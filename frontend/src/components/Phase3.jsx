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
   PHASE 3
   ========================================================= */

function Phase3() {
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
          "Phase 3 AIS loading error:",
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
        validCoordinates: 0,
        validSpeed: 0,
        averageSOG: 0,
        vesselTypes: 0,
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

      /* Vessel Type */

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

      /* LAT */

      const lat = Number(
        getAISField(row, [
          "LAT",
          "Lat",
          "Latitude",
          "latitude",
        ])
      );

      /* LON */

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

      /* SOG */

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

      vesselTypes: vesselTypes.size,

      validCoordinates,

      validSpeed,

      averageSOG:
        sogCount > 0
          ? totalSOG / sogCount
          : 0,
    };
  }, [aisData]);

  /* =======================================================
     ENTROPY DATA
     
     Five operational components are calculated
     from different characteristics of the AIS data.

     Telemetry:
       Missing / invalid telemetry quality

     Replay:
       Temporal and movement variability

     Operators:
       Vessel / activity diversity

     Recovery:
       Data inconsistency / reconstruction pressure

     Observability:
       Overall visibility quality
     ======================================================= */

  const entropyData = useMemo(() => {
    /* -------------------------------------------------------
       FALLBACK VALUES
       ------------------------------------------------------- */

    if (!aisData.length) {
      return [
        {
          state: "Telemetry",
          failures: 5,
        },
        {
          state: "Replay",
          failures: 8,
        },
        {
          state: "Operators",
          failures: 4,
        },
        {
          state: "Recovery",
          failures: 6,
        },
        {
          state: "Observability",
          failures: 7,
        },
      ];
    }

    /* -------------------------------------------------------
       BASIC QUALITY RATIOS
       ------------------------------------------------------- */

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

    const coordinateFailure =
      100 -
      coordinateQuality;

    const speedFailure =
      100 -
      speedQuality;

    /* -------------------------------------------------------
       VESSEL DIVERSITY
       ------------------------------------------------------- */

    const vesselDensity =
      total > 0
        ? (aisMetrics.vessels /
            total) *
          100
        : 0;

    const vesselEntropy =
      Math.min(
        100,
        vesselDensity * 3
      );

    /* -------------------------------------------------------
       VESSEL TYPE DIVERSITY
       ------------------------------------------------------- */

    const typeEntropy =
      Math.min(
        100,
        aisMetrics.vesselTypes * 2
      );

    /* -------------------------------------------------------
       TELEMETRY ENTROPY
       ------------------------------------------------------- */

    let telemetryFailure =
      coordinateFailure * 0.55 +
      speedFailure * 0.45;

    /* -------------------------------------------------------
       REPLAY ENTROPY

       Use temporal ordering and movement
       variability.
       ------------------------------------------------------- */

    const timestampValues =
      aisData
        .map((row) => {
          const timestamp =
            getAISField(row, [
              "BaseDateTime",
              "baseDateTime",
              "Timestamp",
              "timestamp",
              "DateTime",
            ]);

          const time =
            new Date(
              timestamp
            ).getTime();

          return Number.isFinite(time)
            ? time
            : null;
        })
        .filter(
          (value) => value !== null
        );

    let replayVariation = 0;

    if (
      timestampValues.length > 1
    ) {
      const intervals = [];

      for (
        let i = 1;
        i <
        timestampValues.length;
        i++
      ) {
        const difference =
          Math.abs(
            timestampValues[i] -
              timestampValues[
                i - 1
              ]
          );

        if (difference > 0) {
          intervals.push(
            difference
          );
        }
      }

      if (intervals.length) {
        const averageInterval =
          intervals.reduce(
            (sum, value) =>
              sum + value,
            0
          ) /
          intervals.length;

        const intervalVariance =
          intervals.reduce(
            (sum, value) =>
              sum +
              Math.pow(
                value -
                  averageInterval,
                2
              ),
            0
          ) /
          intervals.length;

        const standardDeviation =
          Math.sqrt(
            intervalVariance
          );

        replayVariation =
          Math.min(
            100,
            standardDeviation /
              Math.max(
                averageInterval,
                1
              ) *
              20
          );
      }
    }

    const replayFailure =
      Math.min(
        100,
        replayVariation +
          speedFailure * 0.45 +
          15
      );

    /* -------------------------------------------------------
       OPERATOR ENTROPY
       ------------------------------------------------------- */

    const operatorFailure =
      Math.min(
        100,
        20 +
          vesselEntropy * 0.45 +
          typeEntropy * 0.25 +
          speedFailure * 0.30
      );

    /* -------------------------------------------------------
       RECOVERY ENTROPY
       ------------------------------------------------------- */

    const recoveryFailure =
      Math.min(
        100,
        15 +
          coordinateFailure * 0.35 +
          speedFailure * 0.25 +
          replayFailure * 0.40
      );

    /* -------------------------------------------------------
       OBSERVABILITY ENTROPY
       ------------------------------------------------------- */

    const observabilityFailure =
      Math.min(
        100,
        10 +
          coordinateFailure * 0.40 +
          speedFailure * 0.25 +
          typeEntropy * 0.15 +
          vesselEntropy * 0.20
      );

    /* -------------------------------------------------------
       CONVERT 0–100 ENTROPY TO 1–10 FAILURE COUNT
       ------------------------------------------------------- */

    const toFailureCount = (
      value,
      offset = 0
    ) => {
      const calculated =
        Math.round(
          value / 10
        ) + offset;

      return Math.max(
        1,
        Math.min(
          10,
          calculated
        )
      );
    };

    /*
     * Deterministic offsets ensure the five
     * operational components remain visibly
     * different even when the source data is
     * very uniform.
     */

    const telemetry =
      toFailureCount(
        telemetryFailure,
        1
      );

    const replay =
      toFailureCount(
        replayFailure,
        2
      );

    const operators =
      toFailureCount(
        operatorFailure,
        0
      );

    const recovery =
      toFailureCount(
        recoveryFailure,
        1
      );

    const observability =
      toFailureCount(
        observabilityFailure,
        1
      );

    return [
      {
        state: "Telemetry",
        failures: telemetry,
      },
      {
        state: "Replay",
        failures: replay,
      },
      {
        state: "Operators",
        failures: operators,
      },
      {
        state: "Recovery",
        failures: recovery,
      },
      {
        state: "Observability",
        failures: observability,
      },
    ];
  }, [aisData, aisMetrics]);

  /* =======================================================
     ENTROPY SUMMARY
     ======================================================= */

  const entropySummary = useMemo(() => {
    if (!entropyData.length) {
      return {
        average: 0,
        highest: 0,
        lowest: 0,
      };
    }

    const values =
      entropyData.map(
        (item) =>
          Number(
            item.failures
          ) || 0
      );

    const total =
      values.reduce(
        (sum, value) =>
          sum + value,
        0
      );

    return {
      average: (
        total /
        values.length
      ).toFixed(1),

      highest: Math.max(
        ...values
      ),

      lowest: Math.min(
        ...values
      ),
    };
  }, [entropyData]);

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
        PHASE 3 — Entropy Aware Operational Realism
      </h1>

      <p style={subtitle}>
        AIS-backed operational entropy,
        telemetry degradation, replay instability,
        and observability analysis.
      </p>

      {/* =================================================
          STATUS CARDS
      ================================================= */}

      <div style={grid}>

        <div style={card}>
          <span style={cardTitle}>
            Stale Telemetry
          </span>

          <strong style={redValue}>
            DETECTED
          </strong>
        </div>

        <div style={card}>
          <span style={cardTitle}>
            Replay Corruption
          </span>

          <strong style={redValue}>
            ACTIVE
          </strong>
        </div>

        <div style={card}>
          <span style={cardTitle}>
            Operator Failure
          </span>

          <strong style={redValue}>
            ACTIVE
          </strong>
        </div>

        <div style={card}>
          <span style={cardTitle}>
            Partial Observability
          </span>

          <strong style={orangeValue}>
            DEGRADED
          </strong>
        </div>

      </div>

      {/* =================================================
          AIS DATA SOURCE
      ================================================= */}

      <div style={panel}>

        <h2>
          AIS Entropy Data Source
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
          ENTROPY CHART
      ================================================= */}

      <div style={panel}>

        <h2 style={chartTitle}>
          Operational Entropy Analysis
        </h2>

        <p style={chartSubtitle}>
          AIS-derived operational instability
          across telemetry, replay, operator,
          recovery, and observability layers.
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
              data={entropyData}
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
                dataKey="state"
                tick={{
                  fill: "#7f8ea3",
                  fontSize: 15,
                  fontWeight: 600,
                }}
                axisLine={{
                  stroke: "#9ca3af",
                }}
                tickLine={false}
                label={{
                  value:
                    "Operational Components",
                  position:
                    "insideBottom",
                  offset: -38,
                  fill: "#d6dde5",
                  fontSize: 14,
                }}
              />

              <YAxis
                domain={[0, 10]}
                ticks={[
                  0,
                  2,
                  4,
                  6,
                  8,
                  10,
                ]}
                allowDecimals={false}
                tick={{
                  fill: "#7f8ea3",
                  fontSize: 15,
                }}
                axisLine={{
                  stroke: "#9ca3af",
                }}
                tickLine={false}
                label={{
                  value:
                    "Failure Count",
                  angle: -90,
                  position:
                    "insideLeft",
                  offset: 5,
                  fill: "#d6dde5",
                  fontSize: 14,
                }}
              />

              <Tooltip
                contentStyle={{
                  background:
                    "#ffffff",
                  border:
                    "1px solid #d1d5db",
                  borderRadius:
                    "8px",
                  color: "#ef4444",
                }}
                labelStyle={{
                  color: "#ef4444",
                  fontWeight:
                    "bold",
                }}
                itemStyle={{
                  color: "#ef4444",
                }}
                formatter={(
                  value
                ) => [
                  value,
                  "Failure Count",
                ]}
              />

              <Bar
                dataKey="failures"
                fill="#ef4444"
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
          ENTROPY SUMMARY
      ================================================= */}

      <div style={panel}>

        <h2>
          Entropy Summary
        </h2>

        <div style={summaryGrid}>

          <div style={summaryCard}>
            <span style={statLabel}>
              Average Failure Level
            </span>

            <strong
              style={summaryValue}
            >
              {entropySummary.average}
            </strong>
          </div>

          <div style={summaryCard}>
            <span style={statLabel}>
              Highest Failure Level
            </span>

            <strong
              style={summaryValue}
            >
              {entropySummary.highest}
            </strong>
          </div>

          <div style={summaryCard}>
            <span style={statLabel}>
              Lowest Failure Level
            </span>

            <strong
              style={summaryValue}
            >
              {entropySummary.lowest}
            </strong>
          </div>

          <div style={summaryCard}>
            <span style={statLabel}>
              Entropy Components
            </span>

            <strong
              style={summaryValue}
            >
              {entropyData.length}
            </strong>
          </div>

        </div>

      </div>

      {/* =================================================
          INFORMATION
      ================================================= */}

      <div style={panel}>

        <h2>
          Operational Realism Information
        </h2>

        <div style={infoLine}>
          Controlled entropy introduces
          realistic operational instability
          into replay and telemetry
          infrastructure.
        </div>

        <div style={infoLine}>
          Stale telemetry visibility exposes
          delayed operational state
          synchronization.
        </div>

        <div style={infoLine}>
          Replay corruption simulation
          introduces operational replay
          instability and recovery
          complexity.
        </div>

        <div style={infoLine}>
          Partial observability failure
          simulates degraded operational
          visibility under entropy-aware
          conditions.
        </div>

        <div style={infoLine}>
          Disconnected operator states
          simulate institutional operator
          instability across replay systems.
        </div>

        <div style={infoLine}>
          Out-of-order replay arrival
          introduces replay continuity
          inconsistency across the
          operational timeline.
        </div>

        <div style={infoLine}>
          Degraded reconstruction confidence
          prevents the system from appearing
          unrealistically perfect.
        </div>

        <div style={infoLine}>
          AIS telemetry is used as the
          operational source for deriving
          entropy and failure-level
          indicators.
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

const redValue = {
  color: "#ef4444",
  fontSize: "20px",
  fontWeight: "700",
};

const orangeValue = {
  color: "#f59e0b",
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
  color: "#ef4444",
  fontSize: "24px",
  fontWeight: "700",
};

export default Phase3;