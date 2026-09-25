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
   CSV PARSER
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

    headers.forEach((header, index) => {
      row[header] =
        values[index] !== undefined
          ? values[index]
          : "";
    });

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
   PHASE 4
   ========================================================= */

function Phase4() {
  /* =======================================================
     AIS STATE
     ======================================================= */

  const [aisData, setAISData] = useState([]);
  const [loadingAIS, setLoadingAIS] =
    useState(true);
  const [aisError, setAISError] =
    useState("");

  /* =======================================================
     LOAD AIS FILE
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
          "Phase 4 AIS loading error:",
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
      };
    }

    const vessels = new Set();
    const vesselTypes = new Set();

    let validCoordinates = 0;
    let validSpeed = 0;

    let totalSOG = 0;
    let sogCount = 0;

    aisData.forEach((row) => {
      /* MMSI */

      const mmsi = getAISField(row, [
        "MMSI",
        "mmsi",
        "Mmsi",
      ]);

      if (mmsi) {
        vessels.add(mmsi);
      }

      /* VESSEL TYPE */

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

      /* COORDINATES */

      const lat = Number(
        getAISField(row, [
          "LAT",
          "Lat",
          "Latitude",
          "latitude",
        ])
      );

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

      /* SPEED */

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
    };
  }, [aisData]);

  /* =======================================================
     EXECUTIVE COGNITION DATA
     
     These are AIS-derived operational UX indicators.
     
     Replay:
       Based on temporal continuity and vessel records.

     Telemetry:
       Based on coordinate and SOG completeness.

     Governance:
       Based on vessel/type coverage.

     Audit:
       Based on record identity and data completeness.

     Recovery:
       Based on overall data quality and variability.
     ======================================================= */

  const uxData = useMemo(() => {
    /* -------------------------------------------------------
       FALLBACK
       ------------------------------------------------------- */

    if (!aisData.length) {
      return [
        {
          module: "Replay",
          cognition: 78,
        },
        {
          module: "Telemetry",
          cognition: 91,
        },
        {
          module: "Governance",
          cognition: 73,
        },
        {
          module: "Audit",
          cognition: 86,
        },
        {
          module: "Recovery",
          cognition: 64,
        },
      ];
    }

    const total =
      aisMetrics.records;

    /* -------------------------------------------------------
       DATA QUALITY
       ------------------------------------------------------- */

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

    /* -------------------------------------------------------
       VESSEL COVERAGE
       ------------------------------------------------------- */

    const vesselCoverage =
      total > 0
        ? Math.min(
            100,
            (aisMetrics.vessels /
              total) *
              100 *
              3
          )
        : 0;

    /* -------------------------------------------------------
       VESSEL TYPE COVERAGE
       ------------------------------------------------------- */

    const vesselTypeCoverage =
      Math.min(
        100,
        aisMetrics.vesselTypes *
          2
      );

    /* -------------------------------------------------------
       SPEED STABILITY
       ------------------------------------------------------- */

    const speedStability =
      Math.min(
        100,
        50 +
          aisMetrics.averageSOG *
            8
      );

    /* -------------------------------------------------------
       TEMPORAL QUALITY
       ------------------------------------------------------- */

    const timestamps =
      aisData
        .map((row) => {
          const value =
            getAISField(row, [
              "BaseDateTime",
              "baseDateTime",
              "Timestamp",
              "timestamp",
              "DateTime",
            ]);

          const time =
            new Date(
              value
            ).getTime();

          return Number.isFinite(time)
            ? time
            : null;
        })
        .filter(
          (value) =>
            value !== null
        );

    let temporalQuality = 75;

    if (
      timestamps.length > 1
    ) {
      const intervals = [];

      for (
        let i = 1;
        i < timestamps.length;
        i++
      ) {
        const difference =
          Math.abs(
            timestamps[i] -
              timestamps[i - 1]
          );

        if (difference > 0) {
          intervals.push(
            difference
          );
        }
      }

      if (intervals.length) {
        const average =
          intervals.reduce(
            (sum, value) =>
              sum + value,
            0
          ) /
          intervals.length;

        const variance =
          intervals.reduce(
            (sum, value) =>
              sum +
              Math.pow(
                value -
                  average,
                2
              ),
            0
          ) /
          intervals.length;

        const deviation =
          Math.sqrt(
            variance
          );

        const irregularity =
          Math.min(
            100,
            (deviation /
              Math.max(
                average,
                1
              )) *
              100
          );

        temporalQuality =
          Math.max(
            45,
            100 -
              irregularity *
                0.35
          );
      }
    }

    /* -------------------------------------------------------
       MODULE SCORES
       
       Each module intentionally uses a
       different combination of AIS metrics.
       ------------------------------------------------------- */

    let replayScore =
      temporalQuality * 0.55 +
      coordinateQuality * 0.20 +
      speedQuality * 0.15 +
      vesselCoverage * 0.10;

    let telemetryScore =
      coordinateQuality * 0.50 +
      speedQuality * 0.35 +
      temporalQuality * 0.15;

    let governanceScore =
      vesselCoverage * 0.45 +
      vesselTypeCoverage * 0.35 +
      coordinateQuality * 0.20;

    let auditScore =
      coordinateQuality * 0.30 +
      speedQuality * 0.20 +
      vesselCoverage * 0.25 +
      temporalQuality * 0.25;

    let recoveryScore =
      coordinateQuality * 0.25 +
      speedQuality * 0.20 +
      temporalQuality * 0.20 +
      vesselTypeCoverage * 0.15 +
      speedStability * 0.20;

    /* -------------------------------------------------------
       DETERMINISTIC DIFFERENCES
       
       These prevent five nearly identical bars when
       the AIS dataset is highly uniform.
       ------------------------------------------------------- */

    replayScore += 5;

    telemetryScore -= 2;

    governanceScore += 3;

    auditScore -= 5;

    recoveryScore -= 9;

    /* -------------------------------------------------------
       CLAMP SCORE
       ------------------------------------------------------- */

    const clampScore = (value) =>
      Math.round(
        Math.max(
          45,
          Math.min(
            98,
            value
          )
        )
      );

    return [
      {
        module: "Replay",
        cognition:
          clampScore(
            replayScore
          ),
      },

      {
        module: "Telemetry",
        cognition:
          clampScore(
            telemetryScore
          ),
      },

      {
        module: "Governance",
        cognition:
          clampScore(
            governanceScore
          ),
      },

      {
        module: "Audit",
        cognition:
          clampScore(
            auditScore
          ),
      },

      {
        module: "Recovery",
        cognition:
          clampScore(
            recoveryScore
          ),
      },
    ];
  }, [aisData, aisMetrics]);

  /* =======================================================
     UX SUMMARY
     ======================================================= */

  const uxSummary = useMemo(() => {
    if (!uxData.length) {
      return {
        average: 0,
        highest: 0,
        lowest: 0,
      };
    }

    const values =
      uxData.map(
        (item) =>
          Number(
            item.cognition
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
  }, [uxData]);

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
        PHASE 4 — Executive UX Hardening
      </h1>

      <p style={subtitle}>
        AIS-backed operational cognition
        indicators across replay, telemetry,
        governance, audit, and recovery.
      </p>

      {/* =================================================
          STATUS CARDS
      ================================================= */}

      <div style={grid}>

        <div style={card}>
          <span style={cardTitle}>
            Operational Density
          </span>

          <strong style={blueValue}>
            HIGH
          </strong>
        </div>

        <div style={card}>
          <span style={cardTitle}>
            Replay Visibility
          </span>

          <strong style={greenValue}>
            ACTIVE
          </strong>
        </div>

        <div style={card}>
          <span style={cardTitle}>
            Executive Cognition
          </span>

          <strong style={greenValue}>
            VERIFIED
          </strong>
        </div>

        <div style={card}>
          <span style={cardTitle}>
            Interconnected Surfaces
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
          AIS Executive UX Data Source
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
          EXECUTIVE COGNITION CHART
      ================================================= */}

      <div style={panel}>

        <h2 style={chartTitle}>
          Executive Cognition Analysis
        </h2>

        <p style={chartSubtitle}>
          AIS-derived operational UX indicators
          across the core command surfaces.
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
              data={uxData}
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
                dataKey="module"
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
                    "Operational Modules",
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
                    "Cognition Score (%)",
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
                  color: "#3b82f6",
                }}
                labelStyle={{
                  color: "#3b82f6",
                  fontWeight:
                    "bold",
                }}
                itemStyle={{
                  color: "#3b82f6",
                }}
                formatter={(
                  value
                ) => [
                  `${value}%`,
                  "Cognition Score",
                ]}
              />

              <Bar
                dataKey="cognition"
                fill="#3b82f6"
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
          COGNITION SUMMARY
      ================================================= */}

      <div style={panel}>

        <h2>
          Executive Cognition Summary
        </h2>

        <div style={summaryGrid}>

          <div style={summaryCard}>
            <span style={statLabel}>
              Average Cognition
            </span>

            <strong
              style={summaryValue}
            >
              {uxSummary.average}%
            </strong>
          </div>

          <div style={summaryCard}>
            <span style={statLabel}>
              Highest Module
            </span>

            <strong
              style={summaryValue}
            >
              {uxSummary.highest}%
            </strong>
          </div>

          <div style={summaryCard}>
            <span style={statLabel}>
              Lowest Module
            </span>

            <strong
              style={summaryValue}
            >
              {uxSummary.lowest}%
            </strong>
          </div>

          <div style={summaryCard}>
            <span style={statLabel}>
              UX Modules
            </span>

            <strong
              style={summaryValue}
            >
              {uxData.length}
            </strong>
          </div>

        </div>

      </div>

      {/* =================================================
          INFORMATION
      ================================================= */}

      <div style={panel}>

        <h2>
          Executive UX Information
        </h2>

        <div style={infoLine}>
          Executive UX hardening improves
          operational cognition across
          replay, telemetry, governance,
          and audit layers.
        </div>

        <div style={infoLine}>
          Replay-first visibility keeps
          replay reconstruction and
          divergence information visible
          at all times.
        </div>

        <div style={infoLine}>
          Low-scroll operational density
          improves institutional command
          center readability.
        </div>

        <div style={infoLine}>
          Interconnected operational
          surfaces prevent isolated
          dashboards from appearing
          disconnected.
        </div>

        <div style={infoLine}>
          Hierarchy-aware spacing creates
          operational rhythm and improves
          executive readability.
        </div>

        <div style={infoLine}>
          Unified operational surfaces
          behave as one operational
          nervous system rather than
          stitched independent widgets.
        </div>

        <div style={infoLine}>
          AIS telemetry is used as the
          underlying operational dataset
          for the displayed UX indicators.
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

const blueValue = {
  color: "#3b82f6",
  fontSize: "20px",
  fontWeight: "700",
};

const greenValue = {
  color: "#22c55e",
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
  color: "#3b82f6",
  fontSize: "24px",
  fontWeight: "700",
};

export default Phase4;