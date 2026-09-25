import React, {
  useEffect,
  useMemo,
  useState
} from "react";

import Header from "../components/Header";

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

  return lines
    .slice(1)
    .map((line) => {
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
    });
}

/* =========================================================
   AIS FIELD HELPER
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
   CLAMP
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
   OPERATIONAL STRESS
   ========================================================= */

export default function OperationalStress() {
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
     LOAD AIS DATA
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
              "AIS_file.csv loaded but no records were found."
            );
          }
        } catch (error) {
          console.error(
            "Operational Stress AIS error:",
            error
          );

          if (mounted) {
            setAISError(
              "Unable to load AIS_file.csv. Make sure the file is inside the public folder."
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
            const parsedTime =
              new Date(
                timestamp
              ).getTime();

            if (
              Number.isFinite(
                parsedTime
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
     OPERATIONAL STRESS METRICS
     ======================================================= */

  const stressMetrics =
    useMemo(() => {
      /*
       * Fallback values keep the page
       * functional if AIS is unavailable.
       */

      if (!aisData.length) {
        return {
          systemLoad: 82,
          telemetryDelay: 14,
          fieldStability: 76,
          recoveryConfidence: 89
        };
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

      const vesselDensity =
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
       * Higher data volume/diversity and
       * quality differences produce
       * different operational indicators.
       */

      const dataPressure =
        clamp(
          45 +
            aisMetrics.averageSOG *
              3 +
            typeDiversity *
              0.15 +
            vesselDensity *
              0.12,
          20,
          95
        );

      const qualityGap =
        (
          (100 -
            coordinateQuality) *
            0.30 +
          (100 -
            speedQuality) *
            0.30 +
          (100 -
            timestampQuality) *
            0.40
        );

      const systemLoad =
        Math.round(
          clamp(
            dataPressure +
              qualityGap *
                0.35,
            25,
            95
          )
        );

      const telemetryDelay =
        Math.round(
          clamp(
            5 +
              qualityGap *
                0.16 +
              aisMetrics.averageSOG *
                0.6,
            3,
            30
          )
        );

      const fieldStability =
        Math.round(
          clamp(
            100 -
              qualityGap *
                0.45 -
              systemLoad *
                0.08 +
              vesselDensity *
                0.12,
            45,
            96
          )
        );

      const recoveryConfidence =
        Math.round(
          clamp(
            100 -
              telemetryDelay *
                0.55 -
              qualityGap *
                0.18 +
              timestampQuality *
                0.10,
            55,
            97
          )
        );

      return {
        systemLoad,
        telemetryDelay,
        fieldStability,
        recoveryConfidence
      };
    }, [
      aisData,
      aisMetrics
    ]);

  /* =======================================================
     STRESS TREND
     ======================================================= */

  const stressData =
    useMemo(() => {
      /*
       * Fallback values.
       */

      if (!aisData.length) {
        return [
          35,
          48,
          61,
          74,
          82,
          69
        ];
      }

      const base =
        stressMetrics.systemLoad;

      const quality =
        stressMetrics.fieldStability;

      const delay =
        stressMetrics.telemetryDelay;

      /*
       * Six different stress points.
       */

      const points = [
        base - 29,
        base - 20,
        base - 11,
        base - 4,
        base,
        base -
          Math.round(
            (quality - 50) /
              8
          ) +
          Math.round(
            delay / 5
          )
      ];

      return points.map(
        (value, index) =>
          clamp(
            Math.round(
              value +
                index * 2
            ),
            15,
            95
          )
      );
    }, [
      aisData,
      stressMetrics
    ]);

  /* =======================================================
     STRESS LEVEL
     ======================================================= */

  const stressLevel =
    useMemo(() => {
      const load =
        stressMetrics.systemLoad;

      if (load >= 80) {
        return "HIGH";
      }

      if (load >= 60) {
        return "ELEVATED";
      }

      return "STABLE";
    }, [
      stressMetrics.systemLoad
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
     RUNTIME LOG VALUES
     ======================================================= */

  const runtimeLogs =
    useMemo(() => {
      const now =
        new Date();

      const formatTime =
        (minutesAgo) => {
          const time =
            new Date(
              now.getTime() -
                minutesAgo *
                  60000
            );

          return time.toLocaleTimeString(
            "en-IN",
            {
              hour: "2-digit",
              minute:
                "2-digit",
              hour12: false
            }
          );
        };

      return [
        {
          time:
            formatTime(12),
          text: `Operational load measured at ${stressMetrics.systemLoad}%`,
          type:
            stressMetrics.systemLoad >=
            80
              ? "warning"
              : ""
        },

        {
          time:
            formatTime(10),
          text: `Telemetry synchronization delay: ${stressMetrics.telemetryDelay}s`,
          type:
            stressMetrics.telemetryDelay >=
            12
              ? "warning"
              : ""
        },

        {
          time:
            formatTime(8),
          text: `Runtime stress level: ${stressLevel}`,
          type:
            stressLevel ===
            "HIGH"
              ? "danger"
              : ""
        },

        {
          time:
            formatTime(6),
          text: `Regional balancing evaluated at ${stressMetrics.fieldStability}% stability`,
          type: ""
        },

        {
          time:
            formatTime(4),
          text: `Recovery confidence reached ${stressMetrics.recoveryConfidence}%`,
          type: "positive"
        },

        {
          time:
            formatTime(2),
          text: "Governance continuity maintained",
          type: "positive"
        }
      ];
    }, [
      stressMetrics,
      stressLevel
    ]);

  /* =======================================================
     RENDER
     ======================================================= */

  return (
    <div className="page-container">

      {/* ===================================================
          HEADER
          =================================================== */}

      <Header
        title="Operational Stress"
      />

      {/* ===================================================
          AIS SOURCE STATUS
          =================================================== */}

      <div className="ais-source">

        <div>
          <span className="ais-label">
            AIS OPERATIONAL DATA SOURCE
          </span>

          <strong>
            {loadingAIS
              ? "Loading AIS_file.csv..."
              : aisError
              ? "AIS data unavailable"
              : "AIS telemetry connected"}
          </strong>
        </div>

        <div className="ais-source-stats">

          <div>
            <span>
              Records
            </span>

            <strong>
              {aisMetrics.records.toLocaleString(
                "en-IN"
              )}
            </strong>
          </div>

          <div>
            <span>
              Vessels
            </span>

            <strong>
              {aisMetrics.vessels.toLocaleString(
                "en-IN"
              )}
            </strong>
          </div>

          <div>
            <span>
              Vessel Types
            </span>

            <strong>
              {aisMetrics.vesselTypes.toLocaleString(
                "en-IN"
              )}
            </strong>
          </div>

          <div>
            <span>
              Status
            </span>

            <strong
              className={
                aisStatus ===
                "CONNECTED"
                  ? "ais-connected"
                  : aisStatus ===
                    "ERROR"
                  ? "ais-error"
                  : "ais-loading"
              }
            >
              {aisStatus}
            </strong>
          </div>

        </div>

      </div>

      {/* ===================================================
          TOP STATUS
          =================================================== */}

      <div className="top-status-strip">

        <div className="status-pill">
          Runtime Stable
        </div>

        <div className="status-pill warning-pill">
          Stress {stressLevel}
        </div>

        <div className="status-pill">
          Recovery Active
        </div>

        <div className="status-pill">
          Confidence{" "}
          {
            stressMetrics.recoveryConfidence
          }%
        </div>

      </div>

      {/* ===================================================
          STATUS CARDS
          =================================================== */}

      <div className="executive-grid">

        {/* SYSTEM LOAD */}

        <div className="executive-card">

          <h4>
            System Load
          </h4>

          <h1>
            {
              stressMetrics.systemLoad
            }%
          </h1>

          <span className="danger">
            {stressMetrics.systemLoad >=
            80
              ? "High Operational Pressure"
              : "Operational Pressure Controlled"}
          </span>

        </div>

        {/* TELEMETRY DELAY */}

        <div className="executive-card">

          <h4>
            Telemetry Delay
          </h4>

          <h1>
            {
              stressMetrics.telemetryDelay
            }s
          </h1>

          <span className="warning">
            {stressMetrics.telemetryDelay >=
            12
              ? "Delayed Signal Detection"
              : "Signal Synchronization Stable"}
          </span>

        </div>

        {/* FIELD STABILITY */}

        <div className="executive-card">

          <h4>
            Field Stability
          </h4>

          <h1>
            {
              stressMetrics.fieldStability
            }%
          </h1>

          <span className="positive">
            {stressMetrics.fieldStability >=
            75
              ? "Regional Stress Stabilized"
              : "Regional Stabilization In Progress"}
          </span>

        </div>

        {/* RECOVERY */}

        <div className="executive-card">

          <h4>
            Recovery Confidence
          </h4>

          <h1>
            {
              stressMetrics.recoveryConfidence
            }%
          </h1>

          <span className="positive">
            Recovery Sequence Active
          </span>

        </div>

      </div>

      {/* ===================================================
          STRESS ENGINE
          =================================================== */}

      <div className="page-card">

        <h2>
          Operational Stress Analysis
        </h2>

        <p>
          Runtime stress escalation
          indicators are derived from
          the loaded AIS telemetry
          characteristics.
        </p>

        <p>
          Current system load is{" "}
          <strong>
            {
              stressMetrics.systemLoad
            }%
          </strong>
          .
        </p>

        <p>
          Telemetry synchronization
          delay is{" "}
          <strong>
            {
              stressMetrics.telemetryDelay
            } seconds
          </strong>
          .
        </p>

        <p>
          Field stability is{" "}
          <strong>
            {
              stressMetrics.fieldStability
            }%
          </strong>
          .
        </p>

        <p>
          Recovery confidence is{" "}
          <strong>
            {
              stressMetrics.recoveryConfidence
            }%
          </strong>
          .
        </p>

        <p>
          Governance escalation visibility
          remains preserved through the
          operational monitoring layer.
        </p>

      </div>

      {/* ===================================================
          STRESS TREND CHART
          =================================================== */}

      <div className="chart-card">

        <div className="chart-title">
          Operational Stress Trend
        </div>

        <div className="chart-subtitle">
          AIS-derived operational stress
          indicators
        </div>

        <div className="custom-chart">

          {stressData.map(
            (
              item,
              index
            ) => (
              <div
                key={index}
                className="bar-wrapper"
              >

                <div className="bar-value">
                  {item}%
                </div>

                <div
                  className="bar"
                  style={{
                    height: `${item * 3}px`
                  }}
                ></div>

                <span>
                  T{index + 1}
                </span>

              </div>
            )
          )}

        </div>

        <div className="chart-axis">
          <span>
            Stress Measurement Points
          </span>

          <strong>
            0 — 100%
          </strong>
        </div>

      </div>

      {/* ===================================================
          AIS METRICS
          =================================================== */}

      <div className="metrics-card">

        <h2>
          AIS Telemetry Metrics
        </h2>

        <div className="metrics-grid">

          <div className="metric-item">
            <span>
              Valid Coordinates
            </span>

            <strong>
              {aisMetrics.validCoordinates.toLocaleString(
                "en-IN"
              )}
            </strong>
          </div>

          <div className="metric-item">
            <span>
              Valid Speed Records
            </span>

            <strong>
              {aisMetrics.validSpeed.toLocaleString(
                "en-IN"
              )}
            </strong>
          </div>

          <div className="metric-item">
            <span>
              Valid Timestamps
            </span>

            <strong>
              {aisMetrics.timestamps.toLocaleString(
                "en-IN"
              )}
            </strong>
          </div>

          <div className="metric-item">
            <span>
              Average SOG
            </span>

            <strong>
              {aisMetrics.averageSOG.toFixed(
                2
              )}
            </strong>
          </div>

        </div>

      </div>

      {/* ===================================================
          RUNTIME LOGS
          =================================================== */}

      {/* <div className="log-panel">

        <h3>
          Operational Runtime Logs
        </h3>

        {runtimeLogs.map(
          (
            log,
            index
          ) => (
            <div
              key={index}
              className={`log-item ${
                log.type ===
                "warning"
                  ? "warning-log"
                  : log.type ===
                    "danger"
                  ? "danger-log"
                  : log.type ===
                    "positive"
                  ? "positive-log"
                  : ""
              }`}
            >
              {log.time}{" "}
              {log.text}
            </div>
          )
        )}

      </div> */}

      {/* ===================================================
          STYLES
          =================================================== */}

      <style>{`

        * {
          box-sizing: border-box;
        }

        .page-container {
          min-height: 100vh;
          padding: 24px 30px 40px;

          background:
            radial-gradient(
              circle at 85% 0%,
              rgba(56,189,248,0.08),
              transparent 30%
            ),
            #07111f;

          color: #e8f1f8;

          font-family:
            Inter,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        }

        /* =================================================
           AIS SOURCE
           ================================================= */

        .ais-source {
          margin-top: 22px;

          padding: 16px 20px;

          border-radius: 12px;

          background:
            rgba(16,32,48,0.95);

          border:
            1px solid
            rgba(85,214,255,0.15);

          display: flex;

          justify-content:
            space-between;

          align-items: center;

          gap: 20px;
        }

        .ais-source > div:first-child {
          display: flex;

          flex-direction: column;

          gap: 5px;
        }

        .ais-label {
          color: #55d6ff;

          font-size: 9px;

          font-weight: 700;

          letter-spacing: 1.5px;
        }

        .ais-source strong {
          font-size: 13px;
        }

        .ais-source-stats {
          display: grid;

          grid-template-columns:
            repeat(4, 1fr);

          gap: 24px;
        }

        .ais-source-stats div {
          display: flex;

          flex-direction: column;

          gap: 3px;
        }

        .ais-source-stats span {
          color: #71879b;

          font-size: 8px;

          text-transform:
            uppercase;

          letter-spacing: 0.8px;
        }

        .ais-source-stats strong {
          font-size: 12px;

          color: #dbeafe;
        }

        .ais-connected {
          color: #39e58c !important;
        }

        .ais-error {
          color: #ff6b81 !important;
        }

        .ais-loading {
          color: #ffb454 !important;
        }

        /* =================================================
           TOP STATUS
           ================================================= */

        .top-status-strip {
          display: flex;

          flex-wrap: wrap;

          gap: 12px;

          margin-top: 22px;

          margin-bottom: 22px;
        }

        .status-pill {
          padding: 9px 15px;

          border-radius: 20px;

          border:
            1px solid
            rgba(70,210,245,0.15);

          background:
            rgba(16,32,48,0.85);

          color: #9bb0c3;

          font-size: 11px;

          font-weight: 600;
        }

        .warning-pill {
          color: #ffb454;

          border-color:
            rgba(255,180,84,0.25);
        }

        /* =================================================
           EXECUTIVE GRID
           ================================================= */

        .executive-grid {
          display: grid;

          grid-template-columns:
            repeat(4, minmax(0, 1fr));

          gap: 18px;
        }

        .executive-card {
          padding: 22px;

          border-radius: 12px;

          background:
            linear-gradient(
              145deg,
              rgba(16,32,48,0.98),
              rgba(10,25,40,0.98)
            );

          border:
            1px solid
            rgba(120,160,190,0.12);

          box-shadow:
            0 12px 35px
            rgba(0,0,0,0.12);
        }

        .executive-card h4 {
          margin: 0;

          color: #7f96aa;

          font-size: 10px;

          text-transform:
            uppercase;

          letter-spacing: 1.2px;
        }

        .executive-card h1 {
          margin: 13px 0 7px;

          font-size: 31px;

          letter-spacing: -1px;
        }

        .executive-card span {
          font-size: 10px;

          font-weight: 600;
        }

        .danger {
          color: #ff5d73;
        }

        .warning {
          color: #ffb454;
        }

        .positive {
          color: #46dd91;
        }

        /* =================================================
           PAGE CARD
           ================================================= */

        .page-card {
          margin-top: 22px;

          padding: 24px;

          border-radius: 12px;

          background:
            rgba(16,32,48,0.96);

          border:
            1px solid
            rgba(120,160,190,0.12);
        }

        .page-card h2 {
          margin-top: 0;

          margin-bottom: 17px;

          font-size: 20px;
        }

        .page-card p {
          color: #9db0c0;

          font-size: 12px;

          line-height: 1.8;

          margin: 8px 0;
        }

        .page-card strong {
          color: #ffffff;
        }

        /* =================================================
           CHART
           ================================================= */

        .chart-card {
          margin-top: 22px;

          padding: 24px;

          border-radius: 12px;

          background:
            rgba(16,32,48,0.96);

          border:
            1px solid
            rgba(120,160,190,0.12);

          overflow: hidden;
        }

        .chart-title {
          text-align: center;

          font-size: 25px;

          font-weight: 700;

          color: #ffffff;
        }

        .chart-subtitle {
          text-align: center;

          margin-top: 6px;

          color: #71879b;

          font-size: 10px;
        }

        .custom-chart {
          height: 360px;

          margin-top: 25px;

          padding:
            20px 20px 0;

          display: flex;

          align-items: flex-end;

          justify-content:
            space-evenly;

          gap: 18px;

          border-bottom:
            1px solid
            rgba(255,255,255,0.12);

          background:
            repeating-linear-gradient(
              to top,
              transparent 0px,
              transparent 59px,
              rgba(255,255,255,0.05) 60px
            );
        }

        .bar-wrapper {
          height: 100%;

          flex: 1;

          max-width: 120px;

          display: flex;

          flex-direction: column;

          align-items: center;

          justify-content: flex-end;

          position: relative;
        }

        .bar-value {
          color: #dbeafe;

          font-size: 11px;

          font-weight: 700;

          margin-bottom: 7px;
        }

        .bar {
          width: 70%;

          min-height: 20px;

          border-radius:
            7px 7px 0 0;

          background:
            linear-gradient(
              180deg,
              #ff5d73,
              #ff8b62
            );

          box-shadow:
            0 0 18px
            rgba(255,93,115,0.12);

          transition:
            height 0.4s ease;
        }

        .bar-wrapper > span {
          margin-top: 10px;

          color: #7f96aa;

          font-size: 10px;

          font-weight: 700;
        }

        .chart-axis {
          display: flex;

          justify-content:
            space-between;

          margin-top: 12px;

          color: #71879b;

          font-size: 9px;
        }

        .chart-axis strong {
          color: #9db0c0;
        }

        /* =================================================
           AIS METRICS
           ================================================= */

        .metrics-card {
          margin-top: 22px;

          padding: 22px;

          border-radius: 12px;

          background:
            rgba(16,32,48,0.96);

          border:
            1px solid
            rgba(120,160,190,0.12);
        }

        .metrics-card h2 {
          margin-top: 0;

          font-size: 18px;
        }

        .metrics-grid {
          display: grid;

          grid-template-columns:
            repeat(4, 1fr);

          gap: 14px;

          margin-top: 15px;
        }

        .metric-item {
          padding: 16px;

          border-radius: 9px;

          background:
            rgba(7,17,31,0.75);

          border:
            1px solid
            rgba(120,160,190,0.1);
        }

        .metric-item span {
          display: block;

          color: #71879b;

          font-size: 9px;

          text-transform:
            uppercase;

          letter-spacing: 0.5px;
        }

        .metric-item strong {
          display: block;

          margin-top: 8px;

          color: #55d6ff;

          font-size: 20px;
        }

        /* =================================================
           LOG PANEL
           ================================================= */

        .log-panel {
          margin-top: 22px;

          padding: 22px;

          border-radius: 12px;

          background:
            rgba(16,32,48,0.96);

          border:
            1px solid
            rgba(120,160,190,0.12);
        }

        .log-panel h3 {
          margin-top: 0;

          margin-bottom: 15px;

          font-size: 16px;
        }

        .log-item {
          padding: 11px 14px;

          margin-bottom: 7px;

          border-left:
            3px solid
            #4f7087;

          border-radius: 5px;

          background:
            rgba(255,255,255,0.025);

          color: #9db0c0;

          font-size: 10px;
        }

        .warning-log {
          border-left-color:
            #ffb454;

          color: #ffc777;
        }

        .danger-log {
          border-left-color:
            #ff5d73;

          color: #ff8a9a;
        }

        .positive-log {
          border-left-color:
            #46dd91;

          color: #72e7aa;
        }

        /* =================================================
           RESPONSIVE
           ================================================= */

        @media (max-width: 1100px) {

          .executive-grid {
            grid-template-columns:
              repeat(2, 1fr);
          }

          .ais-source {
            flex-direction: column;

            align-items: flex-start;
          }

          .ais-source-stats {
            width: 100%;
          }

          .metrics-grid {
            grid-template-columns:
              repeat(2, 1fr);
          }

        }

        @media (max-width: 700px) {

          .page-container {
            padding: 18px;
          }

          .executive-grid {
            grid-template-columns: 1fr;
          }

          .ais-source-stats {
            grid-template-columns:
              repeat(2, 1fr);
          }

          .top-status-strip {
            flex-direction: column;
          }

          .status-pill {
            width: 100%;
            text-align: center;
          }

          .metrics-grid {
            grid-template-columns: 1fr;
          }

          .chart-card {
            padding: 16px;
          }

          .custom-chart {
            gap: 8px;

            padding-left: 5px;

            padding-right: 5px;
          }

          .bar {
            width: 75%;
          }

          .chart-title {
            font-size: 21px;
          }

        }

      `}</style>

    </div>
  );
}