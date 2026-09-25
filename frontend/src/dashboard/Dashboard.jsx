import React, { useEffect, useMemo, useState } from "react";

const AIS_FILE = "/AIS_file.csv";

/* ---------------------------------------------------------
   CSV PARSER
--------------------------------------------------------- */

function parseCSV(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let insideQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const next = text[i + 1];

    if (char === '"') {
      if (insideQuotes && next === '"') {
        cell += '"';
        i++;
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === "," && !insideQuotes) {
      row.push(cell.trim());
      cell = "";
    } else if ((char === "\n" || char === "\r") && !insideQuotes) {
      if (char === "\r" && next === "\n") {
        i++;
      }

      row.push(cell.trim());

      if (row.some((value) => value !== "")) {
        rows.push(row);
      }

      row = [];
      cell = "";
    } else {
      cell += char;
    }
  }

  if (cell !== "" || row.length > 0) {
    row.push(cell.trim());

    if (row.some((value) => value !== "")) {
      rows.push(row);
    }
  }

  if (!rows.length) return [];

  const headers = rows[0].map((header) =>
    String(header)
      .trim()
      .replace(/^"|"$/g, "")
  );

  return rows.slice(1).map((values) => {
    const obj = {};

    headers.forEach((header, index) => {
      obj[header] = values[index] ?? "";
    });

    return obj;
  });
}

/* ---------------------------------------------------------
   AIS FIELD HELPER
--------------------------------------------------------- */

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

/* ---------------------------------------------------------
   NORMALIZE AIS RECORD
--------------------------------------------------------- */

function normalizeAISRow(row, index) {
  const mmsi = getAISField(row, [
    "MMSI",
    "mmsi",
    "Mmsi",
    "MMSI Number",
  ]);

  const timestamp = getAISField(row, [
    "BaseDateTime",
    "Base Date Time",
    "Timestamp",
    "timestamp",
    "DateTime",
    "datetime",
  ]);

  const latRaw = getAISField(row, [
    "LAT",
    "Lat",
    "Latitude",
    "latitude",
  ]);

  const lonRaw = getAISField(row, [
    "LON",
    "Lon",
    "Longitude",
    "longitude",
  ]);

  const sogRaw = getAISField(row, [
    "SOG",
    "Sog",
    "Speed",
    "speed",
  ]);

  const vesselType = getAISField(row, [
    "VesselType",
    "Vessel Type",
    "vessel_type",
    "Type",
  ]);

  const lat = Number(latRaw);
  const lon = Number(lonRaw);
  const sog = Number(sogRaw);

  const validCoordinates =
    Number.isFinite(lat) &&
    Number.isFinite(lon) &&
    lat >= -90 &&
    lat <= 90 &&
    lon >= -180 &&
    lon <= 180;

  const validSOG =
    Number.isFinite(sog) &&
    sog >= 0;

  const validTelemetry =
    validCoordinates && validSOG;

  let status = "INVALID";

  if (validTelemetry) {
    if (sog > 0) {
      status = "MOVING";
    } else {
      status = "STATIONARY";
    }
  }

  return {
    id: index + 1,
    mmsi: mmsi || `AIS-${index + 1}`,
    timestamp,
    lat,
    lon,
    sog,
    vesselType: vesselType || "Unknown",
    validCoordinates,
    validSOG,
    validTelemetry,
    status,
  };
}

/* ---------------------------------------------------------
   MAIN DASHBOARD
--------------------------------------------------------- */

export default function Dashboard() {
  const [aisData, setAisData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* -------------------------------------------------------
     LOAD AIS DATA
  ------------------------------------------------------- */

  useEffect(() => {
    let mounted = true;

    async function loadAISData() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(AIS_FILE, {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(
            `Unable to load ${AIS_FILE} (${response.status})`
          );
        }

        const csvText = await response.text();

        const parsedRows = parseCSV(csvText);

        const normalizedRows = parsedRows
          .map(normalizeAISRow)
          .filter(Boolean);

        if (mounted) {
          setAisData(normalizedRows);
        }
      } catch (err) {
        console.error("AIS dashboard error:", err);

        if (mounted) {
          setError(err.message || "Failed to load AIS data");
          setAisData([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadAISData();

    return () => {
      mounted = false;
    };
  }, []);

  /* -------------------------------------------------------
     AIS METRICS
  ------------------------------------------------------- */

  const metrics = useMemo(() => {
    const total = aisData.length;

    const valid = aisData.filter(
      (item) => item.validTelemetry
    ).length;

    const invalid = aisData.filter(
      (item) => !item.validTelemetry
    ).length;

    const moving = aisData.filter(
      (item) =>
        item.validTelemetry &&
        item.status === "MOVING"
    ).length;

    const stationary = aisData.filter(
      (item) =>
        item.validTelemetry &&
        item.status === "STATIONARY"
    ).length;

    const validCoordinates = aisData.filter(
      (item) => item.validCoordinates
    ).length;

    const vessels = new Set(
      aisData
        .map((item) => item.mmsi)
        .filter(Boolean)
    );

    const vesselTypes = new Set(
      aisData
        .map((item) => item.vesselType)
        .filter(
          (type) =>
            type &&
            type !== "Unknown"
        )
    );

    const movingPercentage =
      total > 0
        ? (moving / total) * 100
        : 0;

    const dataHealth =
      total > 0
        ? (valid / total) * 100
        : 0;

    const availability =
      total > 0
        ? (validCoordinates / total) * 100
        : 0;

    const processingEfficiency =
      total > 0
        ? (valid / total) * 100
        : 0;

    const averageSOG =
      valid > 0
        ? aisData
            .filter(
              (item) =>
                item.validSOG
            )
            .reduce(
              (sum, item) =>
                sum + item.sog,
              0
            ) / aisData.filter(
              (item) =>
                item.validSOG
            ).length
        : 0;

    const sortedByTime = [...aisData]
      .filter((item) => item.timestamp)
      .sort((a, b) => {
        const dateA = new Date(
          a.timestamp
        ).getTime();

        const dateB = new Date(
          b.timestamp
        ).getTime();

        return dateB - dateA;
      });

    const latestTimestamp =
      sortedByTime.length > 0
        ? sortedByTime[0].timestamp
        : "N/A";

    return {
      total,
      valid,
      invalid,
      moving,
      stationary,
      validCoordinates,
      uniqueVessels: vessels.size,
      vesselTypes: vesselTypes.size,
      movingPercentage,
      dataHealth,
      availability,
      processingEfficiency,
      averageSOG,
      latestTimestamp,
    };
  }, [aisData]);

  /* -------------------------------------------------------
     STATUS TEXT
  ------------------------------------------------------- */

  const runtimeStatus =
    loading
      ? "Loading"
      : error
      ? "Unavailable"
      : metrics.total > 0
      ? "Operational"
      : "No Data";

  const runtimeDescription =
    loading
      ? "Loading AIS telemetry"
      : error
      ? "AIS data unavailable"
      : `${metrics.total.toLocaleString()} AIS records loaded`;

  const securityStatus =
    metrics.invalid === 0
      ? "Protected"
      : metrics.invalid < metrics.total * 0.05
      ? "Monitoring"
      : "Review Required";

  const securityDescription =
    metrics.invalid === 0
      ? "No AIS validation exceptions"
      : `${metrics.invalid.toLocaleString()} AIS validation exceptions`;

  const databaseStatus =
    aisData.length > 0
      ? "AIS Connected"
      : loading
      ? "Loading"
      : "No Data";

  const databaseDescription =
    aisData.length > 0
      ? "AIS telemetry dataset available"
      : "Waiting for AIS data";

  const platformStatus =
    aisData.length > 0
      ? "Online"
      : loading
      ? "Starting"
      : "Offline";

  const platformDescription =
    aisData.length > 0
      ? "AIS runtime processing enabled"
      : "Runtime data unavailable";

  /* -------------------------------------------------------
     RECENT AIS ACTIVITY
  ------------------------------------------------------- */

  const recentActivity = useMemo(() => {
    return [...aisData]
      .filter((item) => item.timestamp)
      .sort((a, b) => {
        return (
          new Date(b.timestamp).getTime() -
          new Date(a.timestamp).getTime()
        );
      })
      .slice(0, 4);
  }, [aisData]);

  /* -------------------------------------------------------
     LOADING
  ------------------------------------------------------- */

  if (loading) {
    return (
      <div className="page-container">
        <div className="dashboard-header">
          <h1 className="page-title">
            Executive Command Center
          </h1>

          <p className="page-subtitle">
            Unified Cyber Command & Incident
            Intelligence System
          </p>
        </div>

        <div className="panel">
          <h2>Loading AIS Telemetry...</h2>
          <p>
            Reading data from AIS_file.csv
          </p>
        </div>
      </div>
    );
  }

  /* -------------------------------------------------------
     ERROR
  ------------------------------------------------------- */

  if (error) {
    return (
      <div className="page-container">
        <div className="dashboard-header">
          <h1 className="page-title">
            Executive Command Center
          </h1>

          <p className="page-subtitle">
            Unified Cyber Command & Incident
            Intelligence System
          </p>
        </div>

        <div className="panel">
          <h2>AIS Data Error</h2>

          <div className="alert">
            {error}
          </div>

          <p>
            Make sure{" "}
            <strong>
              AIS_file.csv
            </strong>{" "}
            is available inside the React
            application's public folder.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="dashboard-header">
        <h1 className="page-title">
          Executive Command Center
        </h1>

        <p className="page-subtitle">
          Unified Cyber Command & Incident
          Intelligence System
        </p>
      </div>

      {/* =====================================================
          RUNTIME OVERVIEW
      ===================================================== */}

      <div className="overview-grid">

        <div className="overview-card">
          <h3>⚡ Runtime Health</h3>

          <h1>
            {runtimeStatus}
          </h1>

          <p>
            {runtimeDescription}
          </p>
        </div>

        <div className="overview-card">
          <h3>🛡 Security Status</h3>

          <h1>
            {securityStatus}
          </h1>

          <p>
            {securityDescription}
          </p>
        </div>

        <div className="overview-card">
          <h3>🗄 Database</h3>

          <h1>
            {databaseStatus}
          </h1>

          <p>
            {databaseDescription}
          </p>
        </div>

        <div className="overview-card">
          <h3>🌐 Platform Status</h3>

          <h1>
            {platformStatus}
          </h1>

          <p>
            {platformDescription}
          </p>
        </div>

      </div>

      {/* =====================================================
          ANALYTICS
      ===================================================== */}

      <div className="analytics-grid">

        <div className="analytics-card">
          <h3>
            Runtime Processing
          </h3>

          <div className="progress-wrapper">
            <div
              className="progress-bar"
              style={{
                width: `${Math.min(
                  100,
                  metrics.processingEfficiency
                )}%`,
              }}
            />
          </div>

          <p>
            {metrics.processingEfficiency.toFixed(
              1
            )}
            % Efficiency
          </p>
        </div>

        <div className="analytics-card">
          <h3>
            System Availability
          </h3>

          <div className="progress-wrapper">
            <div
              className="progress-bar"
              style={{
                width: `${Math.min(
                  100,
                  metrics.availability
                )}%`,
              }}
            />
          </div>

          <p>
            {metrics.availability.toFixed(
              1
            )}
            % Data Availability
          </p>
        </div>

      </div>

      {/* =====================================================
          AIS DATA SUMMARY
      ===================================================== */}

      <div className="panel">

        <h2>
          AIS Runtime Summary
        </h2>

        <div className="summary-grid">

          <div className="summary-card">
            <h4>
              AIS Records
            </h4>

            <p>
              {metrics.total.toLocaleString()}
            </p>
          </div>

          <div className="summary-card">
            <h4>
              Active Vessel Records
            </h4>

            <p>
              {metrics.moving.toLocaleString()}
            </p>
          </div>

          <div className="summary-card">
            <h4>
              Stationary Records
            </h4>

            <p>
              {metrics.stationary.toLocaleString()}
            </p>
          </div>

          <div className="summary-card">
            <h4>
              Validation Exceptions
            </h4>

            <p>
              {metrics.invalid.toLocaleString()}
            </p>
          </div>

          <div className="summary-card">
            <h4>
              Unique Vessels
            </h4>

            <p>
              {metrics.uniqueVessels.toLocaleString()}
            </p>
          </div>

          <div className="summary-card">
            <h4>
              Vessel Types
            </h4>

            <p>
              {metrics.vesselTypes.toLocaleString()}
            </p>
          </div>

        </div>

      </div>

      {/* =====================================================
          SYSTEM ALERTS
      ===================================================== */}

      <div className="panel">

        <h2>
          System Alerts
        </h2>

        {metrics.invalid === 0 ? (
          <div className="alert success">
            AIS telemetry validation completed
            without exceptions
          </div>
        ) : (
          <div className="alert info">
            {metrics.invalid.toLocaleString()} AIS
            records require validation review
          </div>
        )}

        {metrics.moving > 0 ? (
          <div className="alert info">
            {metrics.moving.toLocaleString()} active
            vessel records detected
          </div>
        ) : (
          <div className="alert info">
            No moving vessel records detected
          </div>
        )}

        <div className="alert success">
          AIS telemetry dataset loaded successfully
        </div>

      </div>

      {/* =====================================================
          RECENT AIS ACTIVITY
      ===================================================== */}

      <div className="panel">

        <h2>
          Recent AIS Activity
        </h2>

        {recentActivity.length === 0 ? (
          <div className="timeline-item">
            <strong>
              No timestamped AIS activity
            </strong>

            <span>
              No recent AIS records available
            </span>
          </div>
        ) : (
          recentActivity.map((item) => (
            <div
              className="timeline-item"
              key={item.id}
            >
              <strong>
                AIS Record #{item.id}
              </strong>

              <span>
                MMSI: {item.mmsi}
                {" • "}
                {item.status}
                {" • "}
                SOG:{" "}
                {Number.isFinite(item.sog)
                  ? item.sog.toFixed(2)
                  : "N/A"}
                {" • "}
                {item.timestamp}
              </span>
            </div>
          ))
        )}

      </div>

      {/* =====================================================
          EXECUTIVE SUMMARY
      ===================================================== */}

      <div className="panel">

        <h2>
          Executive Summary
        </h2>

        <div className="summary-grid">

          <div className="summary-card">
            <h4>
              Runtime Engine
            </h4>

            <p>
              {metrics.total > 0
                ? "Running"
                : "Waiting"}
            </p>
          </div>

          <div className="summary-card">
            <h4>
              AIS Intelligence
            </h4>

            <p>
              {metrics.moving.toLocaleString()} Active
              Records
            </p>
          </div>

          <div className="summary-card">
            <h4>
              Replay Engine
            </h4>

            <p>
              {metrics.uniqueVessels.toLocaleString()}{" "}
              Vessel Traces
            </p>
          </div>

          <div className="summary-card">
            <h4>
              Evidence Store
            </h4>

            <p>
              {metrics.valid.toLocaleString()} Valid
              Records
            </p>
          </div>

        </div>

      </div>

      {/* =====================================================
          DATA HEALTH
      ===================================================== */}

      <div className="panel">

        <h2>
          AIS Data Health
        </h2>

        <div className="summary-grid">

          <div className="summary-card">
            <h4>
              Valid Telemetry
            </h4>

            <p>
              {metrics.valid.toLocaleString()}
            </p>
          </div>

          <div className="summary-card">
            <h4>
              Invalid Telemetry
            </h4>

            <p>
              {metrics.invalid.toLocaleString()}
            </p>
          </div>

          <div className="summary-card">
            <h4>
              Average SOG
            </h4>

            <p>
              {metrics.averageSOG.toFixed(2)}
            </p>
          </div>

          <div className="summary-card">
            <h4>
              Latest AIS Timestamp
            </h4>

            <p>
              {metrics.latestTimestamp}
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}