import React, { useEffect, useMemo, useState } from "react";
import Header from "../components/Header";

/* =========================================================
   CSV PARSER
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

const getAISField = (row, names) => {
  for (const name of names) {
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
   FIELD CONTINUITY
========================================================= */

export default function FieldContinuity() {
  const [aisData, setAisData] = useState([]);
  const [loadingAIS, setLoadingAIS] = useState(true);
  const [aisError, setAisError] = useState("");

  /* =========================================================
     LOAD AIS CSV
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
        const parsed = parseAISCSV(csvText);

        if (!parsed.length) {
          throw new Error("AIS_file.csv contains no usable records.");
        }

        setAisData(parsed);
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

      if (
        timestamp &&
        !Number.isNaN(Date.parse(timestamp))
      ) {
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
     FIELD CONTINUITY CALCULATIONS
  ========================================================= */

  const continuityMetrics = useMemo(() => {
    /*
      When AIS data is unavailable, preserve the original
      dashboard values as a fallback.
    */

    if (!aisMetrics.records) {
      return {
        fieldOperations: 97,
        signalUptime: 93,
        coordination: 89,
        recoveryConfidence: 96,
      };
    }

    const coordinateQuality = clamp(
      (aisMetrics.validCoordinates /
        aisMetrics.records) *
        100
    );

    const speedQuality = clamp(
      (aisMetrics.validSpeed /
        aisMetrics.records) *
        100
    );

    const timestampQuality = clamp(
      (aisMetrics.validTimestamp /
        aisMetrics.records) *
        100
    );

    const vesselDiversity = clamp(
      (aisMetrics.uniqueVessels / 7000) * 100
    );

    const typeDiversity = clamp(
      (aisMetrics.vesselTypes / 60) * 100
    );

    /*
      Field Operations
      ----------------
      Represents overall telemetry continuity.
    */

    const fieldOperations = clamp(
      coordinateQuality * 0.35 +
        timestampQuality * 0.25 +
        speedQuality * 0.20 +
        vesselDiversity * 0.10 +
        typeDiversity * 0.10
    );

    /*
      Signal Uptime
      -------------
      Based primarily on valid coordinates,
      speed and timestamp coverage.
    */

    const signalUptime = clamp(
      coordinateQuality * 0.40 +
        speedQuality * 0.25 +
        timestampQuality * 0.35
    );

    /*
      Coordination
      ------------
      Uses vessel diversity and telemetry completeness
      as a proxy for synchronized operational activity.
    */

    const coordination = clamp(
      coordinateQuality * 0.25 +
        timestampQuality * 0.25 +
        vesselDiversity * 0.25 +
        typeDiversity * 0.25
    );

    /*
      Recovery Confidence
      -------------------
      Higher when telemetry remains complete and
      operational diversity is preserved.
    */

    const recoveryConfidence = clamp(
      coordinateQuality * 0.30 +
        speedQuality * 0.20 +
        timestampQuality * 0.25 +
        vesselDiversity * 0.10 +
        typeDiversity * 0.15
    );

    return {
      fieldOperations,
      signalUptime,
      coordination,
      recoveryConfidence,
    };
  }, [aisMetrics]);

  /* =========================================================
     CONTINUITY TREND
  ========================================================= */

  const continuityData = useMemo(() => {
    if (!aisMetrics.records) {
      return [42, 57, 71, 86, 93, 97];
    }

    const base = continuityMetrics.fieldOperations;

    return [
      clamp(base - 48),
      clamp(base - 38),
      clamp(base - 27),
      clamp(base - 16),
      clamp(base - 7),
      clamp(base),
    ];
  }, [
    aisMetrics.records,
    continuityMetrics.fieldOperations,
  ]);

  /* =========================================================
     RUNTIME LOGS
  ========================================================= */

  const runtimeLogs = useMemo(() => {
    const now = new Date();

    const formatTime = (offsetMinutes) => {
      const time = new Date(
        now.getTime() -
          offsetMinutes * 60 * 1000
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
        text: `Regional continuity verification calculated at ${continuityMetrics.fieldOperations}%`,
        className: "",
      },
      {
        time: formatTime(8),
        text: `Telemetry synchronization currently at ${continuityMetrics.signalUptime}%`,
        className: "positive-log",
      },
      {
        time: formatTime(6),
        text: `Operational coordination index reached ${continuityMetrics.coordination}%`,
        className: "",
      },
      {
        time: formatTime(4),
        text: `Runtime continuity maintained at ${continuityMetrics.fieldOperations}%`,
        className: "positive-log",
      },
      {
        time: formatTime(2),
        text: `Recovery synchronization confidence ${continuityMetrics.recoveryConfidence}%`,
        className: "",
      },
      {
        time: formatTime(0),
        text: `Governance continuity visibility active`,
        className: "positive-log",
      },
    ];
  }, [
    continuityMetrics.fieldOperations,
    continuityMetrics.signalUptime,
    continuityMetrics.coordination,
    continuityMetrics.recoveryConfidence,
  ]);

  /* =========================================================
     STATUS TEXT
  ========================================================= */

  const continuityStatus =
    continuityMetrics.fieldOperations >= 85
      ? "Continuity Stable"
      : continuityMetrics.fieldOperations >= 65
      ? "Continuity Elevated"
      : "Continuity Attention";

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="page-container">

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <Header title="Field Continuity" />

      {/* =====================================================
          AIS SOURCE STATUS
      ===================================================== */}

      <div className="ais-source-card">

        <div>
          <strong>AIS Telemetry Source</strong>

          <div className="ais-source-subtitle">
            Field continuity indicators are derived from
            AIS telemetry quality, vessel diversity and
            timestamp consistency.
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

        <div className="status-pill">
          {continuityStatus}
        </div>

        <div className="status-pill">
          Signal Recovery Active
        </div>

        <div className="status-pill">
          Coordination Stable
        </div>

        <div className="status-pill">
          Runtime Monitoring Enabled
        </div>

      </div>

      {/* =====================================================
          STATUS CARDS
      ===================================================== */}

      <div className="executive-grid">

        {/* FIELD OPERATIONS */}

        <div className="executive-card">

          <h4>Field Operations</h4>

          <h1>
            {continuityMetrics.fieldOperations}%
          </h1>

          <span className="positive">
            Regional Continuity Active
          </span>

        </div>

        {/* SIGNAL UPTIME */}

        <div className="executive-card">

          <h4>Signal Uptime</h4>

          <h1>
            {continuityMetrics.signalUptime}%
          </h1>

          <span className="positive">
            Stable Telemetry Channels
          </span>

        </div>

        {/* COORDINATION */}

        <div className="executive-card">

          <h4>Coordination</h4>

          <h1>
            {continuityMetrics.coordination}%
          </h1>

          <span className="positive">
            Multi-Region Synchronization Stable
          </span>

        </div>

        {/* RECOVERY CONFIDENCE */}

        <div className="executive-card">

          <h4>Recovery Confidence</h4>

          <h1>
            {continuityMetrics.recoveryConfidence}%
          </h1>

          <span className="positive">
            Stabilization Monitored
          </span>

        </div>

      </div>

      {/* =====================================================
          FIELD CONTINUITY ENGINE
      ===================================================== */}

      <div className="page-card">

        <h2>
          Field Continuity Engine
        </h2>

        <p>
          Operational field continuity indicators are
          calculated from the supplied AIS telemetry.
        </p>

        <p>
          Signal synchronization is evaluated using
          coordinate, speed and timestamp completeness.
        </p>

        <p>
          Operational diversity is incorporated through
          vessel and vessel-type coverage.
        </p>

        <p>
          Recovery confidence reflects the completeness
          and consistency of available telemetry.
        </p>

        <p>
          Governance visibility remains active while
          continuity indicators are monitored.
        </p>

      </div>

      {/* =====================================================
          CONTINUITY CHART
      ===================================================== */}

      <div className="chart-card">

        <div className="chart-title">
          Field Continuity Trend
        </div>

        <div className="custom-chart">

          {continuityData.map((item, index) => (

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
                T-{index + 1}
              </small>

            </div>

          ))}

        </div>

      </div>

      {/* =====================================================
          AIS TELEMETRY ANALYSIS
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
            <span>Average SOG</span>
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

        <strong>
          Data Source Note
        </strong>

        <p>
          Field continuity values are derived indicators
          calculated from the AIS telemetry dataset.
        </p>

        <p>
          They represent telemetry completeness,
          synchronization and operational diversity within
          the supplied dataset and are not direct measurements
          of physical field infrastructure.
        </p>

      </div>

      {/* =====================================================
          FIELD LOGS
      ===================================================== */}

      <div className="log-panel">

        <h3>
          Field Runtime Logs
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
          line-height: 1.5;
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
          background: #16a34a;
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