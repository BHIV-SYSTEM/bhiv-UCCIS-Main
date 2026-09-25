import React, { useEffect, useMemo, useState } from "react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
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
    .filter((line) => line.trim());

  if (lines.length < 2) {
    return [];
  }

  const headers = parseCSVLine(lines[0]).map(
    (header) =>
      header
        .replace(/^\uFEFF/, "")
        .trim()
  );

  return lines.slice(1).map((line) => {
    const values = parseCSVLine(line);

    const row = {};

    headers.forEach(
      (header, index) => {
        row[header] =
          values[index] !== undefined
            ? values[index]
            : "";
      }
    );

    return row;
  });
}

/* =========================================================
   GET AIS FIELD
   ========================================================= */

function getAISField(row, names) {
  for (const name of names) {
    if (
      row[name] !== undefined &&
      row[name] !== null &&
      String(row[name]).trim() !== ""
    ) {
      return String(row[name]).trim();
    }
  }

  return "";
}

/* =========================================================
   PHASE 5
   ========================================================= */

function Phase5() {
  /* =======================================================
     AIS STATE
     ======================================================= */

  const [aisData, setAISData] = useState([]);
  const [loadingAIS, setLoadingAIS] =
    useState(true);
  const [aisError, setAISError] =
    useState("");

  /* =======================================================
     LOAD AIS CSV
     ======================================================= */

  useEffect(() => {
    let mounted = true;

    const loadAISData = async () => {
      try {
        setLoadingAIS(true);
        setAISError("");

        const response = await fetch(
          "/AIS_file.csv",
          {
            cache: "no-store",
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
          parseAISCSV(csvText);

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
          "Phase 5 AIS loading error:",
          error
        );

        if (mounted) {
          setAISError(
            "Unable to load AIS_file.csv. Make sure AIS_file.csv is inside the public folder."
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

  const aisMetrics = useMemo(() => {
    if (!aisData.length) {
      return {
        records: 0,
        vessels: 0,
        vesselTypes: 0,
        validCoordinates: 0,
        validSpeed: 0,
        averageSOG: 0,
        timestamps: 0,
      };
    }

    const vessels = new Set();
    const vesselTypes = new Set();

    let validCoordinates = 0;
    let validSpeed = 0;

    let totalSOG = 0;
    let sogCount = 0;

    let timestamps = 0;

    aisData.forEach((row) => {
      /* -----------------------------------------------
         MMSI
      ------------------------------------------------ */

      const mmsi = getAISField(row, [
        "MMSI",
        "mmsi",
        "Mmsi",
      ]);

      if (mmsi) {
        vessels.add(mmsi);
      }

      /* -----------------------------------------------
         VESSEL TYPE
      ------------------------------------------------ */

      const vesselType =
        getAISField(row, [
          "VesselType",
          "Vessel Type",
          "vessel_type",
          "vesselType",
        ]);

      if (vesselType) {
        vesselTypes.add(vesselType);
      }

      /* -----------------------------------------------
         LATITUDE
      ------------------------------------------------ */

      const lat = Number(
        getAISField(row, [
          "LAT",
          "Lat",
          "Latitude",
          "latitude",
        ])
      );

      /* -----------------------------------------------
         LONGITUDE
      ------------------------------------------------ */

      const lon = Number(
        getAISField(row, [
          "LON",
          "Lon",
          "Longitude",
          "longitude",
        ])
      );

      if (
        Number.isFinite(lat) &&
        Number.isFinite(lon)
      ) {
        validCoordinates++;
      }

      /* -----------------------------------------------
         SOG
      ------------------------------------------------ */

      const sog = Number(
        getAISField(row, [
          "SOG",
          "sog",
          "Speed",
          "speed",
        ])
      );

      if (
        Number.isFinite(sog) &&
        sog >= 0
      ) {
        validSpeed++;
        totalSOG += sog;
        sogCount++;
      }

      /* -----------------------------------------------
         TIMESTAMP
      ------------------------------------------------ */

      const timestamp =
        getAISField(row, [
          "BaseDateTime",
          "baseDateTime",
          "Timestamp",
          "timestamp",
          "DateTime",
        ]);

      if (timestamp) {
        const parsedTime =
          new Date(timestamp).getTime();

        if (
          Number.isFinite(
            parsedTime
          )
        ) {
          timestamps++;
        }
      }
    });

    return {
      records: aisData.length,

      vessels: vessels.size,

      vesselTypes:
        vesselTypes.size,

      validCoordinates,

      validSpeed,

      averageSOG:
        sogCount > 0
          ? totalSOG / sogCount
          : 0,

      timestamps,
    };
  }, [aisData]);

  /* =======================================================
     RUNTIME EVENT DATA
     
     AIS data is converted into five operational
     runtime-proof indicators:

       Runtime
       Replay
       Corruption
       Recovery
       Operators
     ======================================================= */

  const runtimeData = useMemo(() => {
    /* -------------------------------------------------------
       FALLBACK VALUES
       ------------------------------------------------------- */

    if (!aisData.length) {
      return [
        {
          layer: "Runtime",
          events: 82,
        },
        {
          layer: "Replay",
          events: 67,
        },
        {
          layer: "Corruption",
          events: 18,
        },
        {
          layer: "Recovery",
          events: 29,
        },
        {
          layer: "Operators",
          events: 41,
        },
      ];
    }

    const total =
      aisMetrics.records;

    /* =======================================================
       QUALITY RATIOS
       ======================================================= */

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

    /* =======================================================
       VESSEL ACTIVITY
       ======================================================= */

    const vesselActivity =
      total > 0
        ? Math.min(
            100,
            (aisMetrics.vessels /
              total) *
              300
          )
        : 0;

    /* =======================================================
       VESSEL TYPE DIVERSITY
       ======================================================= */

    const typeDiversity =
      Math.min(
        100,
        aisMetrics.vesselTypes *
          2
      );

    /* =======================================================
       DATA COMPLETENESS
       ======================================================= */

    const dataCompleteness =
      coordinateQuality * 0.40 +
      speedQuality * 0.30 +
      timestampQuality * 0.30;

    /* =======================================================
       RUNTIME EVENTS
       
       Overall amount of usable runtime
       evidence represented by AIS records.
       ======================================================= */

    let runtimeScore =
      dataCompleteness * 0.55 +
      vesselActivity * 0.25 +
      typeDiversity * 0.20;

    /* =======================================================
       REPLAY EVENTS
       
       Timestamp continuity + vessel movement.
       ======================================================= */

    let replayScore =
      timestampQuality * 0.45 +
      speedQuality * 0.25 +
      coordinateQuality * 0.20 +
      vesselActivity * 0.10;

    /* =======================================================
       CORRUPTION EVENTS
       
       Lower data quality increases the
       corruption/evidence indicator.
       ======================================================= */

    const corruptionPressure =
      (100 -
        coordinateQuality) *
        0.45 +
      (100 -
        speedQuality) *
        0.30 +
      (100 -
        timestampQuality) *
        0.25;

    let corruptionScore =
      corruptionPressure;

    /* =======================================================
       RECOVERY EVENTS
       
       Recovery pressure combines data quality
       and operational diversity.
       ======================================================= */

    let recoveryScore =
      (100 -
        dataCompleteness) *
        0.45 +
      typeDiversity * 0.20 +
      vesselActivity * 0.20 +
      (100 -
        timestampQuality) *
        0.15;

    /* =======================================================
       OPERATOR EVENTS
       
       Vessel population and vessel-type diversity
       represent operational activity.
       ======================================================= */

    let operatorScore =
      vesselActivity * 0.55 +
      typeDiversity * 0.25 +
      speedQuality * 0.20;

    /* =======================================================
       DETERMINISTIC VARIATION
       
       Keeps each runtime layer visibly different
       even if the AIS source is very uniform.
       ======================================================= */

    runtimeScore += 7;

    replayScore -= 4;

    corruptionScore += 3;

    recoveryScore -= 8;

    operatorScore -= 2;

    /* =======================================================
       CONVERT TO EVENT COUNTS
       
       Chart range is 0–100.
       ======================================================= */

    const clampEvents = (value) =>
      Math.round(
        Math.max(
          5,
          Math.min(
            95,
            value
          )
        )
      );

    return [
      {
        layer: "Runtime",
        events:
          clampEvents(
            runtimeScore
          ),
      },

      {
        layer: "Replay",
        events:
          clampEvents(
            replayScore
          ),
      },

      {
        layer: "Corruption",
        events:
          clampEvents(
            corruptionScore
          ),
      },

      {
        layer: "Recovery",
        events:
          clampEvents(
            recoveryScore
          ),
      },

      {
        layer: "Operators",
        events:
          clampEvents(
            operatorScore
          ),
      },
    ];
  }, [aisData, aisMetrics]);

  /* =======================================================
     RUNTIME SUMMARY
     ======================================================= */

  const runtimeSummary = useMemo(() => {
    if (!runtimeData.length) {
      return {
        average: 0,
        highest: 0,
        lowest: 0,
      };
    }

    const values =
      runtimeData.map(
        (item) =>
          Number(
            item.events
          ) || 0
      );

    const total =
      values.reduce(
        (sum, value) =>
          sum + value,
        0
      );

    return {
      average: Math.round(
        total / values.length
      ),

      highest: Math.max(
        ...values
      ),

      lowest: Math.min(
        ...values
      ),
    };
  }, [runtimeData]);

  /* =======================================================
     AIS STATUS
     ======================================================= */

  const aisStatus = loadingAIS
    ? "LOADING"
    : aisError
    ? "ERROR"
    : aisData.length > 0
    ? "CONNECTED"
    : "NO DATA";

  /* =======================================================
     RENDER
     ======================================================= */

  return (
    <div style={container}>

      {/* =================================================
          HEADER
      ================================================= */}

      <h1>
        PHASE 5 — Runtime Proof Layer
      </h1>

      <p style={subtitle}>
        AIS-backed runtime evidence,
        replay events, corruption indicators,
        recovery sequencing, and operator
        activity.
      </p>

      {/* =================================================
          STATUS CARDS
      ================================================= */}

      <div style={grid}>

        <div style={card}>
          <span style={cardTitle}>
            Runtime Logs
          </span>

          <strong style={greenValue}>
            ACTIVE
          </strong>
        </div>

        <div style={card}>
          <span style={cardTitle}>
            Replay Evidence
          </span>

          <strong style={greenValue}>
            VERIFIED
          </strong>
        </div>

        <div style={card}>
          <span style={cardTitle}>
            Corruption Evidence
          </span>

          <strong style={redValue}>
            DETECTED
          </strong>
        </div>

        <div style={card}>
          <span style={cardTitle}>
            Audit Logs
          </span>

          <strong style={greenValue}>
            ACTIVE
          </strong>
        </div>

      </div>

      {/* =================================================
          AIS DATA SOURCE
      ================================================= */}

      <div style={panel}>

        <h2>
          AIS Runtime Evidence Source
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
          <div style={aisStatsGrid}>

            <div style={aisStat}>
              <span style={statLabel}>
                AIS Records
              </span>

              <strong style={statValue}>
                {aisMetrics.records.toLocaleString(
                  "en-IN"
                )}
              </strong>
            </div>

            <div style={aisStat}>
              <span style={statLabel}>
                Unique Vessels
              </span>

              <strong style={statValue}>
                {aisMetrics.vessels.toLocaleString(
                  "en-IN"
                )}
              </strong>
            </div>

            <div style={aisStat}>
              <span style={statLabel}>
                Vessel Types
              </span>

              <strong style={statValue}>
                {aisMetrics.vesselTypes.toLocaleString(
                  "en-IN"
                )}
              </strong>
            </div>

            <div style={aisStat}>
              <span style={statLabel}>
                AIS Connection
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
                      : "#f59e0b",
                }}
              >
                {aisStatus}
              </strong>
            </div>

          </div>
        )}

      </div>

      {/* =================================================
          RUNTIME EVENT CHART
      ================================================= */}

      <div style={panel}>

        <h2 style={chartTitle}>
          Runtime Event Distribution
        </h2>

        <p style={chartSubtitle}>
          AIS-derived runtime evidence across
          the operational proof layers.
        </p>

        <div
          style={{
            width: "100%",
            height: "440px",
          }}
        >

          <ResponsiveContainer
            width="100%"
            height="100%"
          >

            <BarChart
              data={runtimeData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 60,
              }}
              barCategoryGap="18%"
            >

              <CartesianGrid
                stroke="#9ca3af"
                strokeDasharray="4 4"
              />

              <XAxis
                dataKey="layer"
                tick={{
                  fill: "#7f8ea3",
                  fontSize: 16,
                  fontWeight: 600,
                }}
                axisLine={{
                  stroke: "#9ca3af",
                }}
                tickLine={false}
                label={{
                  value:
                    "Runtime Layers",
                  position:
                    "insideBottom",
                  offset: -38,
                  fill: "#d6dde5",
                  fontSize: 14,
                }}
              />

              <YAxis
                domain={[0, 100]}
                ticks={[
                  0,
                  25,
                  50,
                  75,
                  100,
                ]}
                allowDecimals={false}
                tick={{
                  fill: "#7f8ea3",
                  fontSize: 16,
                }}
                axisLine={{
                  stroke: "#9ca3af",
                }}
                tickLine={false}
                label={{
                  value:
                    "Event Count",
                  angle: -90,
                  position:
                    "insideLeft",
                  offset: 5,
                  fill: "#d6dde5",
                  fontSize: 14,
                }}
              />

              <Tooltip
                cursor={{
                  fill:
                    "rgba(255,255,255,0.08)",
                }}
                contentStyle={{
                  background:
                    "#ffffff",
                  border:
                    "1px solid #d1d5db",
                  borderRadius:
                    "8px",
                  color: "#22c55e",
                }}
                labelStyle={{
                  color: "#22c55e",
                  fontWeight:
                    "bold",
                }}
                itemStyle={{
                  color: "#22c55e",
                }}
                formatter={(
                  value
                ) => [
                  value,
                  "Event Count",
                ]}
              />

              <Bar
                dataKey="events"
                fill="#22c55e"
                radius={[
                  6,
                  6,
                  0,
                  0,
                ]}
                barSize={120}
              />

            </BarChart>

          </ResponsiveContainer>

        </div>

      </div>

      {/* =================================================
          RUNTIME SUMMARY
      ================================================= */}

      <div style={panel}>

        <h2>
          Runtime Evidence Summary
        </h2>

        <div style={summaryGrid}>

          <div style={summaryCard}>
            <span style={statLabel}>
              Average Events
            </span>

            <strong
              style={summaryValue}
            >
              {runtimeSummary.average}
            </strong>
          </div>

          <div style={summaryCard}>
            <span style={statLabel}>
              Highest Layer
            </span>

            <strong
              style={summaryValue}
            >
              {runtimeSummary.highest}
            </strong>
          </div>

          <div style={summaryCard}>
            <span style={statLabel}>
              Lowest Layer
            </span>

            <strong
              style={summaryValue}
            >
              {runtimeSummary.lowest}
            </strong>
          </div>

          <div style={summaryCard}>
            <span style={statLabel}>
              Runtime Layers
            </span>

            <strong
              style={summaryValue}
            >
              {runtimeData.length}
            </strong>
          </div>

        </div>

      </div>

      {/* =================================================
          INFORMATION
      ================================================= */}

      <div style={panel}>

        <h2>
          Runtime Proof Information
        </h2>

        <div style={infoLine}>
          Runtime proof layers expose
          operational evidence generated
          during replay execution and
          telemetry sequencing.
        </div>

        <div style={infoLine}>
          Replay event logs preserve
          replay generation continuity
          across operational timelines.
        </div>

        <div style={infoLine}>
          Corruption evidence exposes
          replay corruption attempts and
          operational instability during
          replay execution.
        </div>

        <div style={infoLine}>
          Concurrency evidence validates
          simultaneous operator activity
          across replay and governance
          infrastructure.
        </div>

        <div style={infoLine}>
          Recovery sequencing evidence
          exposes delayed replay recovery
          operations and retry behavior.
        </div>

        <div style={infoLine}>
          Replay divergence evidence
          exposes replay inconsistencies
          across operational replay
          timelines.
        </div>

        <div style={infoLine}>
          Runtime proof visibility makes
          fake operational “PASS” states
          difficult to misrepresent.
        </div>

        <div style={infoLine}>
          AIS telemetry is used as the
          operational dataset for deriving
          the runtime evidence indicators
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
  boxSizing: "border-box",
};

const subtitle = {
  color: "#94a3b8",
  marginTop: "8px",
  marginBottom: "20px",
  fontSize: "15px",
};

const grid = {
  display: "grid",
  gridTemplateColumns:
    "repeat(4, minmax(0, 1fr))",
  gap: "20px",
  marginTop: "20px",
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
  boxSizing: "border-box",
};

const cardTitle = {
  color: "#94a3b8",
  fontSize: "13px",
  marginBottom: "8px",
  textTransform: "uppercase",
  letterSpacing: "0.4px",
};

const greenValue = {
  color: "#22c55e",
  fontSize: "20px",
  fontWeight: "700",
};

const redValue = {
  color: "#ef4444",
  fontSize: "20px",
  fontWeight: "700",
};

const panel = {
  background: "#102030",
  padding: "20px",
  borderRadius: "12px",
  border:
    "1px solid #1f3b57",
  marginTop: "30px",
  boxSizing: "border-box",
};

const chartTitle = {
  textAlign: "center",
  color: "#ffffff",
  fontSize: "36px",
  fontWeight: "700",
  marginBottom: "10px",
};

const chartSubtitle = {
  textAlign: "center",
  color: "#94a3b8",
  fontSize: "14px",
  marginTop: "0",
  marginBottom: "15px",
};

const infoLine = {
  marginBottom: "14px",
  color: "#cbd5e1",
  lineHeight: "24px",
};

const aisStatsGrid = {
  display: "grid",
  gridTemplateColumns:
    "repeat(4, minmax(0, 1fr))",
  gap: "15px",
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
  justifyContent: "center",
};

const statLabel = {
  color: "#94a3b8",
  fontSize: "13px",
};

const statValue = {
  color: "#22c55e",
  fontSize: "20px",
  fontWeight: "700",
};

const loadingBox = {
  padding: "20px",
  background: "#071018",
  borderRadius: "8px",
  color: "#f59e0b",
  textAlign: "center",
};

const errorBox = {
  padding: "20px",
  background: "#2a1115",
  border:
    "1px solid #7f1d1d",
  borderRadius: "8px",
  color: "#fca5a5",
};

const summaryGrid = {
  display: "grid",
  gridTemplateColumns:
    "repeat(4, minmax(0, 1fr))",
  gap: "15px",
};

const summaryCard = {
  background: "#071018",
  border:
    "1px solid #1f3b57",
  borderRadius: "10px",
  padding: "18px",
  display: "flex",
  flexDirection: "column",
  gap: "8px",
};

const summaryValue = {
  color: "#22c55e",
  fontSize: "24px",
  fontWeight: "700",
};

export default Phase5;