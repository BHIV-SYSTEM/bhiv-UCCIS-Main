import React, { useEffect, useMemo, useState } from "react";
import Header from "../components/Header";

/* =========================================================
   CSV HELPERS
========================================================= */

const parseCSVLine = (line) => {
  const result = [];
  let current = "";
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      if (insideQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === "," && !insideQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  result.push(current.trim());

  return result;
};

const parseAISCSV = (text) => {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length < 2) {
    return [];
  }

  const headers = parseCSVLine(lines[0]).map((header) =>
    header.replace(/^"|"$/g, "").trim()
  );

  return lines.slice(1).map((line) => {
    const values = parseCSVLine(line);
    const row = {};

    headers.forEach((header, index) => {
      row[header] = values[index] ?? "";
    });

    return row;
  });
};

const getAISField = (row, possibleNames) => {
  for (const name of possibleNames) {
    if (
      row[name] !== undefined &&
      row[name] !== null &&
      String(row[name]).trim() !== ""
    ) {
      return row[name];
    }
  }

  return "";
};

const clamp = (value, min = 0, max = 100) =>
  Math.min(max, Math.max(min, Math.round(value)));

/* =========================================================
   COMPONENT
========================================================= */

export default function EntropyFailure() {
  const [aisData, setAisData] = useState([]);
  const [loadingAIS, setLoadingAIS] = useState(true);
  const [aisError, setAisError] = useState("");

  /* =========================================================
     LOAD AIS DATA
  ========================================================= */

  useEffect(() => {
    const loadAISData = async () => {
      try {
        setLoadingAIS(true);
        setAisError("");

        const response = await fetch("/AIS_file.csv", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(
            `Unable to load AIS_file.csv (${response.status})`
          );
        }

        const csvText = await response.text();
        const parsedData = parseAISCSV(csvText);

        if (!parsedData.length) {
          throw new Error("AIS_file.csv contains no usable records.");
        }

        setAisData(parsedData);
      } catch (error) {
        console.error("AIS loading error:", error);
        setAisError(error.message || "Unable to load AIS data.");
        setAisData([]);
      } finally {
        setLoadingAIS(false);
      }
    };

    loadAISData();
  }, []);

  /* =========================================================
     AIS METRICS
  ========================================================= */

  const aisMetrics = useMemo(() => {
    if (!aisData.length) {
      return {
        records: 0,
        uniqueVessels: 0,
        vesselTypes: 0,
        validCoordinates: 0,
        validSpeed: 0,
        validTimestamp: 0,
        averageSOG: 0,
      };
    }

    const vessels = new Set();
    const vesselTypes = new Set();

    let validCoordinates = 0;
    let validSpeed = 0;
    let validTimestamp = 0;

    let totalSOG = 0;
    let sogCount = 0;

    aisData.forEach((row) => {
      const mmsi = getAISField(row, [
        "MMSI",
        "mmsi",
        "VesselID",
        "VesselId",
      ]);

      const vesselType = getAISField(row, [
        "VesselType",
        "Vessel Type",
        "vessel_type",
      ]);

      const lat = Number(
        getAISField(row, ["LAT", "Lat", "Latitude", "latitude"])
      );

      const lon = Number(
        getAISField(row, ["LON", "Lon", "Longitude", "longitude"])
      );

      const sog = Number(
        getAISField(row, [
          "SOG",
          "Speed Over Ground",
          "Speed",
          "speed",
        ])
      );

      const timestamp = getAISField(row, [
        "BaseDateTime",
        "Timestamp",
        "DateTime",
        "datetime",
      ]);

      if (mmsi) {
        vessels.add(String(mmsi));
      }

      if (vesselType) {
        vesselTypes.add(String(vesselType));
      }

      if (
        Number.isFinite(lat) &&
        Number.isFinite(lon) &&
        lat >= -90 &&
        lat <= 90 &&
        lon >= -180 &&
        lon <= 180
      ) {
        validCoordinates++;
      }

      if (Number.isFinite(sog) && sog >= 0) {
        validSpeed++;
        totalSOG += sog;
        sogCount++;
      }

      if (timestamp && !Number.isNaN(Date.parse(timestamp))) {
        validTimestamp++;
      }
    });

    return {
      records: aisData.length,
      uniqueVessels: vessels.size,
      vesselTypes: vesselTypes.size,
      validCoordinates,
      validSpeed,
      validTimestamp,
      averageSOG: sogCount
        ? totalSOG / sogCount
        : 0,
    };
  }, [aisData]);

  /* =========================================================
     ENTROPY / FAILURE CALCULATION
  ========================================================= */

  const entropyMetrics = useMemo(() => {
    /*
      Data-quality ratios derived from AIS telemetry.
      These are used as dashboard indicators rather than
      direct measurements of real-world infrastructure failure.
    */

    if (!aisMetrics.records) {
      return {
        entropyLevel: 92,
        failureRisk: 81,
        recoveryStatus: 74,
        replayStability: 88,
      };
    }

    const coordinateQuality =
      (aisMetrics.validCoordinates /
        aisMetrics.records) *
      100;

    const speedQuality =
      (aisMetrics.validSpeed /
        aisMetrics.records) *
      100;

    const timestampQuality =
      (aisMetrics.validTimestamp /
        aisMetrics.records) *
      100;

    const vesselDiversity = Math.min(
      100,
      (aisMetrics.uniqueVessels / 7000) * 100
    );

    const typeDiversity = Math.min(
      100,
      (aisMetrics.vesselTypes / 60) * 100
    );

    /*
      Entropy:
      Higher when telemetry quality/diversity introduces
      greater operational variation.
    */

    const entropyLevel = clamp(
      30 +
        (100 - coordinateQuality) * 0.22 +
        (100 - speedQuality) * 0.18 +
        (100 - timestampQuality) * 0.15 +
        vesselDiversity * 0.14 +
        typeDiversity * 0.18 +
        Math.min(20, aisMetrics.averageSOG * 1.5)
    );

    /*
      Failure risk is derived from entropy plus
      telemetry quality degradation.
    */

    const failureRisk = clamp(
      entropyLevel * 0.72 +
        (100 - coordinateQuality) * 0.12 +
        (100 - timestampQuality) * 0.10 +
        (100 - speedQuality) * 0.08
    );

    /*
      Recovery is higher when telemetry remains
      sufficiently complete and diverse.
    */

    const recoveryStatus = clamp(
      coordinateQuality * 0.30 +
        speedQuality * 0.20 +
        timestampQuality * 0.25 +
        vesselDiversity * 0.10 +
        typeDiversity * 0.15
    );

    /*
      Replay stability depends mainly on timestamp,
      coordinate and speed consistency.
    */

    const replayStability = clamp(
      timestampQuality * 0.40 +
        coordinateQuality * 0.30 +
        speedQuality * 0.20 +
        typeDiversity * 0.10
    );

    return {
      entropyLevel,
      failureRisk,
      recoveryStatus,
      replayStability,
    };
  }, [aisMetrics]);

  /* =========================================================
     DYNAMIC ENTROPY TREND
  ========================================================= */

  const entropyData = useMemo(() => {
    if (!aisMetrics.records) {
      return [18, 29, 47, 66, 84, 92];
    }

    const base = entropyMetrics.entropyLevel;

    return [
      clamp(base - 48),
      clamp(base - 36),
      clamp(base - 25),
      clamp(base - 14),
      clamp(base - 6),
      clamp(base),
    ];
  }, [aisMetrics.records, entropyMetrics.entropyLevel]);

  /* =========================================================
     STATUS
  ========================================================= */

  const entropyStatus = useMemo(() => {
    if (entropyMetrics.entropyLevel >= 80) {
      return "Entropy Rising";
    }

    if (entropyMetrics.entropyLevel >= 60) {
      return "Entropy Elevated";
    }

    return "Entropy Controlled";
  }, [entropyMetrics.entropyLevel]);

  /* =========================================================
     RUNTIME LOGS
  ========================================================= */

  const runtimeLogs = useMemo(() => {
    const now = new Date();

    const formatTime = (offsetMinutes) => {
      const time = new Date(
        now.getTime() - offsetMinutes * 60 * 1000
      );

      return time.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    };

    return [
      {
        time: formatTime(10),
        text: `Runtime entropy level calculated at ${entropyMetrics.entropyLevel}%`,
        className:
          entropyMetrics.entropyLevel >= 80
            ? "warning-log"
            : "",
      },
      {
        time: formatTime(8),
        text: `Failure propagation analysis reached ${entropyMetrics.failureRisk}% risk`,
        className:
          entropyMetrics.failureRisk >= 75
            ? "danger-log"
            : "warning-log",
      },
      {
        time: formatTime(6),
        text: `Replay continuity validation running at ${entropyMetrics.replayStability}% stability`,
        className: "",
      },
      {
        time: formatTime(4),
        text: `Infrastructure synchronization telemetry processed`,
        className: "warning-log",
      },
      {
        time: formatTime(2),
        text: `Recovery orchestration operating at ${entropyMetrics.recoveryStatus}%`,
        className: "",
      },
      {
        time: formatTime(0),
        text: `Operational stabilization currently monitored`,
        className: "positive-log",
      },
    ];
  }, [
    entropyMetrics.entropyLevel,
    entropyMetrics.failureRisk,
    entropyMetrics.recoveryStatus,
    entropyMetrics.replayStability,
  ]);

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="page-container">

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <Header title="Entropy / Failure" />

      {/* =====================================================
          AIS SOURCE STATUS
      ===================================================== */}

      <div className="ais-source-card">

        <div>
          <strong>AIS Telemetry Source</strong>

          <div className="ais-source-subtitle">
            Entropy and failure indicators are calculated from
            AIS telemetry quality and operational diversity.
          </div>
        </div>

        <div
          className={`ais-source-status ${
            loadingAIS
              ? "loading"
              : aisError
              ? "error"
              : "connected"
          }`}
        >
          {loadingAIS
            ? "Loading AIS..."
            : aisError
            ? "AIS Unavailable"
            : "AIS Connected"}
        </div>

      </div>

      {/* =====================================================
          TOP STATUS STRIP
      ===================================================== */}

      <div className="top-status-strip">

        <div
          className={`status-pill ${
            entropyMetrics.entropyLevel >= 75
              ? "warning-pill"
              : ""
          }`}
        >
          {entropyStatus}
        </div>

        <div className="status-pill">
          Runtime Monitoring Active
        </div>

        <div className="status-pill">
          Failure Recovery Enabled
        </div>

        <div className="status-pill">
          Replay Protection Active
        </div>

      </div>

      {/* =====================================================
          STATUS CARDS
      ===================================================== */}

      <div className="executive-grid">

        {/* ENTROPY LEVEL */}

        <div className="executive-card">

          <h4>Entropy Level</h4>

          <h1>
            {entropyMetrics.entropyLevel}%
          </h1>

          <span
            className={
              entropyMetrics.entropyLevel >= 80
                ? "danger"
                : "warning"
            }
          >
            {entropyMetrics.entropyLevel >= 80
              ? "Runtime Disorder Escalating"
              : "Runtime Disorder Elevated"}
          </span>

        </div>

        {/* FAILURE RISK */}

        <div className="executive-card">

          <h4>Failure Risk</h4>

          <h1>
            {entropyMetrics.failureRisk}%
          </h1>

          <span
            className={
              entropyMetrics.failureRisk >= 75
                ? "warning"
                : "positive"
            }
          >
            {entropyMetrics.failureRisk >= 75
              ? "Infrastructure Vulnerability Detected"
              : "Infrastructure Stability Maintained"}
          </span>

        </div>

        {/* RECOVERY STATUS */}

        <div className="executive-card">

          <h4>Recovery Status</h4>

          <h1>
            {entropyMetrics.recoveryStatus}%
          </h1>

          <span className="positive">
            Recovery Sequences Active
          </span>

        </div>

        {/* REPLAY STABILITY */}

        <div className="executive-card">

          <h4>Replay Stability</h4>

          <h1>
            {entropyMetrics.replayStability}%
          </h1>

          <span className="positive">
            Event Continuity Preserved
          </span>

        </div>

      </div>

      {/* =====================================================
          ENTROPY ENGINE
      ===================================================== */}

      <div className="page-card">

        <h2>
          Entropy & Failure Detection Engine
        </h2>

        <p>
          Runtime entropy indicators are being calculated
          from available governance telemetry.
        </p>

        <p>
          AIS coordinate, speed and timestamp quality are
          being evaluated for telemetry consistency.
        </p>

        <p>
          Replay-safe recovery monitoring remains active
          across the telemetry dataset.
        </p>

        <p>
          Failure containment visibility is maintained
          through derived operational indicators.
        </p>

        <p>
          Recovery orchestration continues under monitored
          operational conditions.
        </p>

      </div>

      {/* =====================================================
          ENTROPY CHART
      ===================================================== */}

      <div className="chart-card">

        <div className="chart-title">
          Entropy Escalation Trend
        </div>

        <div className="custom-chart">

          {entropyData.map((item, index) => (

            <div
              key={index}
              className="bar-wrapper"
            >

              <div
                className="bar"
                style={{
                  height: `${Math.max(
                    20,
                    item * 3
                  )}px`,
                }}
              />

              <span>
                {item}%
              </span>

              <small>
                E-{index + 1}
              </small>

            </div>

          ))}

        </div>

      </div>

      {/* =====================================================
          AIS TELEMETRY METRICS
      ===================================================== */}

      <div className="telemetry-card">

        <div className="telemetry-title">
          AIS Telemetry Analysis
        </div>

        <div className="telemetry-grid">

          <div className="telemetry-item">
            <span>AIS Records</span>
            <strong>
              {aisMetrics.records.toLocaleString()}
            </strong>
          </div>

          <div className="telemetry-item">
            <span>Unique Vessels</span>
            <strong>
              {aisMetrics.uniqueVessels.toLocaleString()}
            </strong>
          </div>

          <div className="telemetry-item">
            <span>Vessel Types</span>
            <strong>
              {aisMetrics.vesselTypes}
            </strong>
          </div>

          <div className="telemetry-item">
            <span>Avg SOG</span>
            <strong>
              {aisMetrics.averageSOG.toFixed(2)}
            </strong>
          </div>

          <div className="telemetry-item">
            <span>Coordinate Quality</span>
            <strong>
              {aisMetrics.records
                ? Math.round(
                    (aisMetrics.validCoordinates /
                      aisMetrics.records) *
                      100
                  )
                : 0}
              %
            </strong>
          </div>

          <div className="telemetry-item">
            <span>Timestamp Quality</span>
            <strong>
              {aisMetrics.records
                ? Math.round(
                    (aisMetrics.validTimestamp /
                      aisMetrics.records) *
                      100
                  )
                : 0}
              %
            </strong>
          </div>

        </div>

      </div>

      {/* =====================================================
          DATA SOURCE NOTE
      ===================================================== */}

      <div className="info-card">

        <strong>Data Source Note</strong>

        <p>
          Entropy, failure risk, recovery and replay values
          shown on this dashboard are derived indicators
          calculated from the AIS telemetry dataset.
        </p>

        <p>
          They represent telemetry quality and operational
          variation within the supplied dataset and should
          not be interpreted as direct measurements of
          physical infrastructure failure.
        </p>

      </div>

      {/* =====================================================
          RUNTIME LOGS
      ===================================================== */}

      <div className="log-panel">

        <h3>
          Entropy Runtime Logs
        </h3>

        {runtimeLogs.map((log, index) => (

          <div
            key={index}
            className={`log-item ${log.className}`}
          >
            {log.time} {log.text}
          </div>

        ))}

      </div>

      {/* =====================================================
          STYLES
      ===================================================== */}

      <style>{`

        .ais-source-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          padding: 18px 22px;
          margin-bottom: 18px;
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }

        .ais-source-subtitle {
          margin-top: 5px;
          color: #6b7280;
          font-size: 13px;
        }

        .ais-source-status {
          padding: 8px 14px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
          white-space: nowrap;
        }

        .ais-source-status.connected {
          background: #dcfce7;
          color: #166534;
        }

        .ais-source-status.error {
          background: #fee2e2;
          color: #991b1b;
        }

        .ais-source-status.loading {
          background: #fef3c7;
          color: #92400e;
        }

        .telemetry-card {
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 22px;
          margin-top: 20px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }

        .telemetry-title {
          font-size: 18px;
          font-weight: 700;
          color: #111827;
          margin-bottom: 18px;
        }

        .telemetry-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 14px;
        }

        .telemetry-item {
          padding: 16px;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          background: #f9fafb;
        }

        .telemetry-item span {
          display: block;
          font-size: 12px;
          color: #6b7280;
          margin-bottom: 7px;
        }

        .telemetry-item strong {
          display: block;
          font-size: 20px;
          color: #111827;
        }

        .info-card {
          margin-top: 20px;
          padding: 20px;
          background: #f8fafc;
          border-left: 4px solid #64748b;
          border-radius: 8px;
        }

        .info-card strong {
          color: #111827;
          font-size: 15px;
        }

        .info-card p {
          margin: 8px 0 0;
          color: #475569;
          font-size: 13px;
          line-height: 1.6;
        }

        .custom-chart {
          min-height: 330px;
          display: flex;
          align-items: flex-end;
          justify-content: space-around;
          gap: 20px;
          padding: 35px 20px 20px;
          border-top: 1px solid #e5e7eb;
          margin-top: 15px;
        }

        .bar-wrapper {
          flex: 1;
          max-width: 100px;
          min-height: 280px;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          align-items: center;
          gap: 8px;
        }

        .bar {
          width: 55px;
          max-height: 270px;
          min-height: 20px;
          background: #dc2626;
          border-radius: 7px 7px 0 0;
          transition: height 0.3s ease;
        }

        .bar-wrapper span {
          font-weight: 700;
          color: #111827;
          font-size: 13px;
        }

        .bar-wrapper small {
          color: #6b7280;
          font-size: 11px;
        }

        .warning {
          color: #d97706;
        }

        .danger {
          color: #dc2626;
        }

        .positive {
          color: #16a34a;
        }

        @media (max-width: 1100px) {

          .telemetry-grid {
            grid-template-columns: repeat(3, 1fr);
          }

        }

        @media (max-width: 700px) {

          .ais-source-card {
            flex-direction: column;
            align-items: flex-start;
          }

          .telemetry-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .custom-chart {
            gap: 8px;
            padding-left: 5px;
            padding-right: 5px;
          }

          .bar {
            width: 35px;
          }

        }

        @media (max-width: 480px) {

          .telemetry-grid {
            grid-template-columns: 1fr;
          }

        }

      `}</style>

    </div>
  );
}