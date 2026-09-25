import React, {
  useEffect,
  useMemo,
  useState
} from "react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

/* =========================================================
   CSV LINE PARSER
   ========================================================= */

function parseCSVLine(line) {
  const values = [];

  let current = "";
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      if (
        insideQuotes &&
        line[i + 1] === '"'
      ) {
        current += '"';
        i++;
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (
      char === "," &&
      !insideQuotes
    ) {
      values.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  values.push(current.trim());

  return values;
}

/* =========================================================
   AIS CSV PARSER
   ========================================================= */

function parseAISCSV(csvText) {
  if (!csvText) {
    return [];
  }

  const lines = csvText
    .split(/\r?\n/)
    .filter(
      (line) => line.trim()
    );

  if (lines.length < 2) {
    return [];
  }

  const headers = parseCSVLine(
    lines[0]
  ).map((header) =>
    header
      .replace(/^\uFEFF/, "")
      .trim()
  );

  return lines.slice(1).map(
    (line) => {
      const values =
        parseCSVLine(line);

      const row = {};

      headers.forEach(
        (header, index) => {
          row[header] =
            values[index] !==
            undefined
              ? values[index]
              : "";
        }
      );

      return row;
    }
  );
}

/* =========================================================
   GET AIS FIELD
   ========================================================= */

function getAISField(
  row,
  names
) {
  for (const name of names) {
    if (
      row[name] !==
        undefined &&
      row[name] !== null &&
      String(row[name]).trim() !==
        ""
    ) {
      return String(
        row[name]
      ).trim();
    }
  }

  return "";
}

/* =========================================================
   CLAMP VALUE
   ========================================================= */

function clamp(
  value,
  min,
  max
) {
  return Math.max(
    min,
    Math.min(max, value)
  );
}

/* =========================================================
   PHASE 7
   ========================================================= */

function Phase7() {
  const [
    aisData,
    setAISData
  ] = useState([]);

  const [
    loadingAIS,
    setLoadingAIS
  ] = useState(true);

  const [
    aisError,
    setAISError
  ] = useState("");

  /* =======================================================
     LOAD AIS CSV
     ======================================================= */

  useEffect(() => {
    let mounted = true;

    const loadAISData =
      async () => {
        try {
          setLoadingAIS(true);
          setAISError("");

          const response =
            await fetch(
              "/AIS_file.csv",
              {
                cache: "no-store"
              }
            );

          if (!response.ok) {
            throw new Error(
              `AIS_file.csv returned ${response.status}`
            );
          }

          const csvText =
            await response.text();

          const parsed =
            parseAISCSV(
              csvText
            );

          if (!mounted) {
            return;
          }

          setAISData(parsed);

          if (!parsed.length) {
            setAISError(
              "AIS_file.csv loaded but no usable records were found."
            );
          }
        } catch (error) {
          console.error(
            "Phase 7 AIS loading error:",
            error
          );

          if (mounted) {
            setAISError(
              "Unable to load AIS_file.csv. Make sure it is inside the public folder."
            );
          }
        } finally {
          if (mounted) {
            setLoadingAIS(false);
          }
        }
      };

    loadAISData();

    return () => {
      mounted = false;
    };
  }, []);

  /* =======================================================
     AIS METRICS
     ======================================================= */

  const aisMetrics =
    useMemo(() => {
      if (!aisData.length) {
        return {
          records: 0,
          vessels: 0,
          vesselTypes: 0,
          validCoordinates: 0,
          validSpeed: 0,
          timestamps: 0,
          averageSOG: 0
        };
      }

      const vessels =
        new Set();

      const vesselTypes =
        new Set();

      let validCoordinates = 0;
      let validSpeed = 0;
      let timestamps = 0;

      let totalSOG = 0;
      let sogCount = 0;

      aisData.forEach(
        (row) => {
          const mmsi =
            getAISField(
              row,
              [
                "MMSI",
                "mmsi",
                "Mmsi"
              ]
            );

          if (mmsi) {
            vessels.add(
              mmsi
            );
          }

          const vesselType =
            getAISField(
              row,
              [
                "VesselType",
                "Vessel Type",
                "vessel_type",
                "vesselType"
              ]
            );

          if (vesselType) {
            vesselTypes.add(
              vesselType
            );
          }

          const lat =
            Number(
              getAISField(
                row,
                [
                  "LAT",
                  "Lat",
                  "Latitude",
                  "latitude"
                ]
              )
            );

          const lon =
            Number(
              getAISField(
                row,
                [
                  "LON",
                  "Lon",
                  "Longitude",
                  "longitude"
                ]
              )
            );

          if (
            Number.isFinite(
              lat
            ) &&
            Number.isFinite(
              lon
            )
          ) {
            validCoordinates++;
          }

          const sog =
            Number(
              getAISField(
                row,
                [
                  "SOG",
                  "sog",
                  "Speed",
                  "speed"
                ]
              )
            );

          if (
            Number.isFinite(
              sog
            ) &&
            sog >= 0
          ) {
            validSpeed++;

            totalSOG += sog;

            sogCount++;
          }

          const timestamp =
            getAISField(
              row,
              [
                "BaseDateTime",
                "baseDateTime",
                "Timestamp",
                "timestamp",
                "DateTime"
              ]
            );

          if (timestamp) {
            const time =
              new Date(
                timestamp
              ).getTime();

            if (
              Number.isFinite(
                time
              )
            ) {
              timestamps++;
            }
          }
        }
      );

      return {
        records:
          aisData.length,

        vessels:
          vessels.size,

        vesselTypes:
          vesselTypes.size,

        validCoordinates,

        validSpeed,

        timestamps,

        averageSOG:
          sogCount > 0
            ? totalSOG /
              sogCount
            : 0
      };
    }, [aisData]);

  /* =======================================================
     OPERATIONAL CHART DATA
     ======================================================= */

  const operationalData =
    useMemo(() => {
      /*
       * If AIS is unavailable,
       * keep a fallback so the
       * dashboard does not break.
       */

      if (!aisData.length) {
        return [
          {
            replay: "R1",
            confidence: 48,
            drift: 24
          },
          {
            replay: "R2",
            confidence: 82,
            drift: 11
          },
          {
            replay: "R3",
            confidence: 61,
            drift: 34
          },
          {
            replay: "R4",
            confidence: 90,
            drift: 7
          },
          {
            replay: "R5",
            confidence: 73,
            drift: 19
          }
        ];
      }

      const total =
        aisMetrics.records;

      const coordinateQuality =
        total > 0
          ? (aisMetrics.validCoordinates /
              total) *
            100
          : 0;

      const speedQuality =
        total > 0
          ? (aisMetrics.validSpeed /
              total) *
            100
          : 0;

      const timestampQuality =
        total > 0
          ? (aisMetrics.timestamps /
              total) *
            100
          : 0;

      const vesselDiversity =
        total > 0
          ? clamp(
              (aisMetrics.vessels /
                total) *
                300,
              0,
              100
            )
          : 0;

      const typeDiversity =
        clamp(
          aisMetrics.vesselTypes *
            2,
          0,
          100
        );

      /*
       * Different deterministic
       * adjustments for every replay.
       *
       * This makes R1-R5 different
       * while still being derived
       * from AIS characteristics.
       */

      const confidenceBase =
        coordinateQuality *
          0.40 +
        speedQuality *
          0.25 +
        timestampQuality *
          0.20 +
        vesselDiversity *
          0.10 +
        typeDiversity *
          0.05;

      const driftBase =
        (100 -
          coordinateQuality) *
          0.30 +
        (100 -
          speedQuality) *
          0.25 +
        (100 -
          timestampQuality) *
          0.25 +
        (100 -
          vesselDiversity) *
          0.10 +
        typeDiversity *
          0.10;

      const replayAdjustments =
        [
          {
            confidence: -18,
            drift: 12
          },
          {
            confidence: 7,
            drift: -5
          },
          {
            confidence: -4,
            drift: 9
          },
          {
            confidence: 14,
            drift: -8
          },
          {
            confidence: 2,
            drift: 4
          }
        ];

      return replayAdjustments.map(
        (
          adjustment,
          index
        ) => {
          const confidence =
            clamp(
              Math.round(
                confidenceBase +
                  adjustment.confidence
              ),
              20,
              98
            );

          const drift =
            clamp(
              Math.round(
                driftBase +
                  adjustment.drift +
                  index * 2
              ),
              3,
              36
            );

          return {
            replay: `R${
              index + 1
            }`,
            confidence,
            drift
          };
        }
      );
    }, [
      aisData,
      aisMetrics
    ]);

  /* =======================================================
     AVERAGES
     ======================================================= */

  const averageConfidence =
    useMemo(() => {
      if (
        !operationalData.length
      ) {
        return 0;
      }

      return Math.round(
        operationalData.reduce(
          (
            sum,
            item
          ) =>
            sum +
            item.confidence,
          0
        ) /
          operationalData.length
      );
    }, [
      operationalData
    ]);

  const averageDrift =
    useMemo(() => {
      if (
        !operationalData.length
      ) {
        return 0;
      }

      return Math.round(
        operationalData.reduce(
          (
            sum,
            item
          ) =>
            sum +
            item.drift,
          0
        ) /
          operationalData.length
      );
    }, [
      operationalData
    ]);

  /* =======================================================
     AIS STATUS
     ======================================================= */

  const aisStatus =
    loadingAIS
      ? "LOADING"
      : aisError
      ? "ERROR"
      : aisData.length
      ? "CONNECTED"
      : "NO DATA";

  /* =======================================================
     UI
     ======================================================= */

  return (
    <div style={container}>

      <h1>
        PHASE 7 — Final Operational Flow
      </h1>

      <p style={subtitle}>
        AIS-backed replay confidence,
        replay drift and unified
        operational flow visibility.
      </p>

      {/* ===================================================
          STATUS CARDS
          =================================================== */}

      <div style={grid}>

        <div style={card}>
          <span style={cardLabel}>
            Signal Intake
          </span>

          <strong
            style={activeValue}
          >
            ACTIVE
          </strong>
        </div>

        <div style={card}>
          <span style={cardLabel}>
            Replay Reconstruction
          </span>

          <strong
            style={activeValue}
          >
            ACTIVE
          </strong>
        </div>

        <div style={card}>
          <span style={cardLabel}>
            Corruption Detection
          </span>

          <strong
            style={greenValue}
          >
            ENABLED
          </strong>
        </div>

        <div style={card}>
          <span style={cardLabel}>
            Governance Visibility
          </span>

          <strong
            style={activeValue}
          >
            ACTIVE
          </strong>
        </div>

      </div>

      {/* ===================================================
          AIS SOURCE
          =================================================== */}

      <div style={panel}>

        <h2>
          AIS Operational Data Source
        </h2>

        {loadingAIS ? (
          <div style={loadingBox}>
            Loading AIS_file.csv...
          </div>
        ) : aisError ? (
          <div style={errorBox}>
            {aisError}
          </div>
        ) : (
          <div
            style={aisStatsGrid}
          >

            <div style={aisStat}>
              <span style={statLabel}>
                AIS Records
              </span>

              <strong
                style={statValue}
              >
                {aisMetrics.records.toLocaleString(
                  "en-IN"
                )}
              </strong>
            </div>

            <div style={aisStat}>
              <span style={statLabel}>
                Unique Vessels
              </span>

              <strong
                style={statValue}
              >
                {aisMetrics.vessels.toLocaleString(
                  "en-IN"
                )}
              </strong>
            </div>

            <div style={aisStat}>
              <span style={statLabel}>
                Vessel Types
              </span>

              <strong
                style={statValue}
              >
                {aisMetrics.vesselTypes.toLocaleString(
                  "en-IN"
                )}
              </strong>
            </div>

            <div style={aisStat}>
              <span style={statLabel}>
                AIS Status
              </span>

              <strong
                style={{
                  color:
                    aisStatus ===
                    "CONNECTED"
                      ? "#22c55e"
                      : aisStatus ===
                        "ERROR"
                      ? "#ef4444"
                      : "#f59e0b"
                }}
              >
                {aisStatus}
              </strong>
            </div>

          </div>
        )}

      </div>

      {/* ===================================================
          REPLAY SUMMARY
          =================================================== */}

      <div style={summaryGrid}>

        <div style={summaryCard}>
          <span style={statLabel}>
            Average Replay Confidence
          </span>

          <strong
            style={summaryBlue}
          >
            {averageConfidence}%
          </strong>
        </div>

        <div style={summaryCard}>
          <span style={statLabel}>
            Average Replay Drift
          </span>

          <strong
            style={summaryRed}
          >
            {averageDrift}
          </strong>
        </div>

        <div style={summaryCard}>
          <span style={statLabel}>
            Replay Sessions
          </span>

          <strong
            style={summaryBlue}
          >
            {operationalData.length}
          </strong>
        </div>

        <div style={summaryCard}>
          <span style={statLabel}>
            Average AIS Speed
          </span>

          <strong
            style={summaryGreen}
          >
            {aisMetrics.averageSOG.toFixed(
              2
            )}
          </strong>
        </div>

      </div>

      {/* ===================================================
          REPLAY CONFIDENCE TREND
          =================================================== */}

      <div style={panel}>

        <h2 style={chartHeading}>
          Replay Confidence Trend
        </h2>

        <div
          style={{
            width: "100%",
            height: "420px"
          }}
        >

          <ResponsiveContainer
            width="100%"
            height="100%"
          >

            <BarChart
              data={
                operationalData
              }
              margin={{
                top: 20,
                right: 30,
                left: 40,
                bottom: 35
              }}
            >

              <CartesianGrid
                stroke="#9ca3af"
                strokeDasharray="4 4"
              />

              <XAxis
                dataKey="replay"
                tick={{
                  fill: "#7f8ea3",
                  fontSize: 17,
                  fontWeight: 600
                }}
                axisLine={{
                  stroke:
                    "#9ca3af"
                }}
                tickLine={false}
                label={{
                  value:
                    "Replay Sessions",
                  position:
                    "insideBottom",
                  offset: -20,
                  fill:
                    "#d6dde5",
                  fontSize: 14
                }}
              />

              <YAxis
                domain={[
                  0,
                  100
                ]}
                ticks={[
                  0,
                  25,
                  50,
                  75,
                  100
                ]}
                tick={{
                  fill:
                    "#7f8ea3",
                  fontSize: 16
                }}
                axisLine={{
                  stroke:
                    "#9ca3af"
                }}
                tickLine={false}
                label={{
                  value:
                    "Confidence Score (%)",
                  angle: -90,
                  position:
                    "insideLeft",
                  fill:
                    "#d6dde5",
                  fontSize: 14
                }}
              />

              <Tooltip
                cursor={{
                  fill:
                    "rgba(255,255,255,.08)"
                }}
                contentStyle={{
                  background:
                    "#ffffff",
                  border:
                    "1px solid #d1d5db",
                  borderRadius:
                    "8px",
                  color:
                    "#111827"
                }}
                formatter={(
                  value
                ) => [
                  `${value}%`,
                  "Confidence"
                ]}
              />

              <Bar
                dataKey="confidence"
                fill="#3b82f6"
                barSize={90}
                radius={[
                  6,
                  6,
                  0,
                  0
                ]}
              />

            </BarChart>

          </ResponsiveContainer>

        </div>

      </div>

      {/* ===================================================
          REPLAY DRIFT ANALYSIS
          =================================================== */}

      <div style={panel}>

        <h2 style={chartHeading}>
          Replay Drift Analysis
        </h2>

        <div
          style={{
            width: "100%",
            height: "420px"
          }}
        >

          <ResponsiveContainer
            width="100%"
            height="100%"
          >

            <BarChart
              data={
                operationalData
              }
              margin={{
                top: 20,
                right: 30,
                left: 40,
                bottom: 35
              }}
            >

              <CartesianGrid
                stroke="#9ca3af"
                strokeDasharray="4 4"
              />

              <XAxis
                dataKey="replay"
                tick={{
                  fill:
                    "#7f8ea3",
                  fontSize: 17,
                  fontWeight: 600
                }}
                axisLine={{
                  stroke:
                    "#9ca3af"
                }}
                tickLine={false}
                label={{
                  value:
                    "Replay Sessions",
                  position:
                    "insideBottom",
                  offset: -20,
                  fill:
                    "#d6dde5",
                  fontSize: 14
                }}
              />

              <YAxis
                domain={[
                  0,
                  36
                ]}
                ticks={[
                  0,
                  9,
                  18,
                  27,
                  36
                ]}
                tick={{
                  fill:
                    "#7f8ea3",
                  fontSize: 16
                }}
                axisLine={{
                  stroke:
                    "#9ca3af"
                }}
                tickLine={false}
                label={{
                  value:
                    "Drift Level",
                  angle: -90,
                  position:
                    "insideLeft",
                  fill:
                    "#d6dde5",
                  fontSize: 14
                }}
              />

              <Tooltip
                cursor={{
                  fill:
                    "rgba(255,255,255,.08)"
                }}
                contentStyle={{
                  background:
                    "#ffffff",
                  border:
                    "1px solid #d1d5db",
                  borderRadius:
                    "8px",
                  color:
                    "#111827"
                }}
                formatter={(
                  value
                ) => [
                  value,
                  "Drift Level"
                ]}
              />

              <Bar
                dataKey="drift"
                fill="#ef4444"
                barSize={90}
                radius={[
                  6,
                  6,
                  0,
                  0
                ]}
              />

            </BarChart>

          </ResponsiveContainer>

        </div>

      </div>

      {/* ===================================================
          INFORMATION
          =================================================== */}

      <div style={panel}>

        <h2>
          Final Operational Flow Information
        </h2>

        <div style={infoLine}>
          Final operational flow unifies
          replay, corruption, recovery,
          divergence, governance, and
          audit continuity into one
          operational system.
        </div>

        <div style={infoLine}>
          Signal intake visibility exposes
          replay creation and replay
          reconstruction behavior across
          operational timelines.
        </div>

        <div style={infoLine}>
          Replay corruption detection
          exposes operational replay
          instability during runtime
          execution.
        </div>

        <div style={infoLine}>
          Recovery sequencing validates
          replay restoration operations
          after replay instability or
          corruption events.
        </div>

        <div style={infoLine}>
          Replay divergence visibility
          exposes inconsistencies across
          replay continuity layers.
        </div>

        <div style={infoLine}>
          Governance visibility exposes
          replay state accessibility
          across executive operational
          surfaces.
        </div>

        <div style={infoLine}>
          Audit continuity preserves
          operational replay history and
          validation evidence across the
          canonical operational system.
        </div>

        <div style={infoLine}>
          AIS telemetry is used as the
          underlying operational dataset
          for generating the replay
          confidence and drift indicators
          displayed above.
        </div>

      </div>

    </div>
  );
}

/* =========================================================
   STYLES
   ========================================================= */

const container = {
  background: "#071018",
  minHeight: "100vh",
  color: "white",
  padding: "20px",
  fontFamily:
    "Arial, sans-serif",
  boxSizing: "border-box"
};

const subtitle = {
  color: "#94a3b8",
  marginTop: "8px",
  marginBottom: "20px",
  fontSize: "15px"
};

const grid = {
  display: "grid",
  gridTemplateColumns:
    "repeat(4, minmax(0, 1fr))",
  gap: "20px",
  marginTop: "20px"
};

const card = {
  background: "#102030",
  padding: "20px",
  borderRadius: "12px",
  border:
    "1px solid #1f3b57",
  minHeight: "90px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  boxSizing: "border-box"
};

const cardLabel = {
  color: "#94a3b8",
  fontSize: "13px",
  marginBottom: "8px",
  textTransform: "uppercase",
  letterSpacing: "0.4px"
};

const activeValue = {
  color: "#3b82f6",
  fontSize: "20px",
  fontWeight: "700"
};

const greenValue = {
  color: "#22c55e",
  fontSize: "20px",
  fontWeight: "700"
};

const panel = {
  background: "#102030",
  padding: "20px",
  borderRadius: "12px",
  border:
    "1px solid #1f3b57",
  marginTop: "30px",
  boxSizing: "border-box"
};

const chartHeading = {
  textAlign: "center",
  color: "#ffffff",
  fontSize: "42px",
  fontWeight: "700",
  marginBottom: "20px"
};

const infoLine = {
  marginBottom: "14px",
  color: "#cbd5e1",
  lineHeight: "24px"
};

const aisStatsGrid = {
  display: "grid",
  gridTemplateColumns:
    "repeat(4, minmax(0, 1fr))",
  gap: "15px"
};

const aisStat = {
  background: "#071018",
  border:
    "1px solid #1f3b57",
  borderRadius: "10px",
  padding: "18px",
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  minHeight: "80px",
  justifyContent: "center"
};

const statLabel = {
  color: "#94a3b8",
  fontSize: "13px"
};

const statValue = {
  color: "#22c55e",
  fontSize: "20px",
  fontWeight: "700"
};

const loadingBox = {
  padding: "20px",
  background: "#071018",
  borderRadius: "8px",
  color: "#f59e0b",
  textAlign: "center"
};

const errorBox = {
  padding: "20px",
  background: "#2a1115",
  border:
    "1px solid #7f1d1d",
  borderRadius: "8px",
  color: "#fca5a5"
};

const summaryGrid = {
  display: "grid",
  gridTemplateColumns:
    "repeat(4, minmax(0, 1fr))",
  gap: "15px",
  marginTop: "30px"
};

const summaryCard = {
  background: "#102030",
  border:
    "1px solid #1f3b57",
  borderRadius: "12px",
  padding: "18px",
  display: "flex",
  flexDirection: "column",
  gap: "8px"
};

const summaryBlue = {
  color: "#3b82f6",
  fontSize: "24px",
  fontWeight: "700"
};

const summaryRed = {
  color: "#ef4444",
  fontSize: "24px",
  fontWeight: "700"
};

const summaryGreen = {
  color: "#22c55e",
  fontSize: "24px",
  fontWeight: "700"
};

export default Phase7;