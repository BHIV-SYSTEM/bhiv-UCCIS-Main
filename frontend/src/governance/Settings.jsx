import React, { useEffect, useMemo, useState } from "react";

const AIS_FILE = "/AIS_file.csv";

/* =========================================================
   CSV PARSER
========================================================= */

function parseCSV(text) {
  const rows = [];
  let row = [];
  let value = "";
  let insideQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];

    if (char === '"') {
      if (insideQuotes && next === '"') {
        value += '"';
        i += 1;
      } else {
        insideQuotes = !insideQuotes;
      }
      continue;
    }

    if (char === "," && !insideQuotes) {
      row.push(value);
      value = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !insideQuotes) {
      if (char === "\r" && next === "\n") {
        i += 1;
      }

      row.push(value);
      value = "";

      if (row.some((item) => item.trim() !== "")) {
        rows.push(row);
      }

      row = [];
      continue;
    }

    value += char;
  }

  if (value.length > 0 || row.length > 0) {
    row.push(value);

    if (row.some((item) => item.trim() !== "")) {
      rows.push(row);
    }
  }

  if (rows.length < 2) {
    return [];
  }

  const headers = rows[0].map((header) =>
    String(header || "")
      .replace(/^\uFEFF/, "")
      .replace(/^"|"$/g, "")
      .trim()
  );

  return rows.slice(1).map((values) => {
    const record = {};

    headers.forEach((header, index) => {
      record[header] = String(values[index] ?? "")
        .trim()
        .replace(/^"|"$/g, "");
    });

    return record;
  });
}

/* =========================================================
   AIS HELPERS
========================================================= */

function getField(row, names) {
  const keys = Object.keys(row || {});

  for (const name of names) {
    const wanted = String(name).toLowerCase().trim();

    const key = keys.find(
      (item) =>
        String(item).toLowerCase().trim() === wanted
    );

    if (
      key !== undefined &&
      row[key] !== undefined &&
      row[key] !== null &&
      String(row[key]).trim() !== ""
    ) {
      return row[key];
    }
  }

  return "";
}

function toNumber(value) {
  const number = Number.parseFloat(value);
  return Number.isFinite(number) ? number : null;
}

function normalizeAISRow(row) {
  return {
    mmsi: String(
      getField(row, ["MMSI", "mmsi", "Mmsi"])
    ).trim(),

    timestamp: String(
      getField(row, [
        "BaseDateTime",
        "baseDateTime",
        "Timestamp",
        "timestamp",
        "DateTime",
        "datetime",
      ])
    ).trim(),

    lat: toNumber(
      getField(row, [
        "LAT",
        "Lat",
        "Latitude",
        "latitude",
      ])
    ),

    lon: toNumber(
      getField(row, [
        "LON",
        "Lon",
        "Longitude",
        "longitude",
      ])
    ),

    sog: toNumber(
      getField(row, [
        "SOG",
        "sog",
        "Speed",
        "speed",
        "SpeedOverGround",
      ])
    ),

    vesselType: String(
      getField(row, [
        "VesselType",
        "Vessel Type",
        "vessel_type",
        "ShipType",
        "ship_type",
      ])
    ).trim(),
  };
}

function isValidCoordinates(row) {
  return (
    Number.isFinite(row.lat) &&
    Number.isFinite(row.lon) &&
    row.lat >= -90 &&
    row.lat <= 90 &&
    row.lon >= -180 &&
    row.lon <= 180
  );
}

function isValidSpeed(row) {
  return Number.isFinite(row.sog) && row.sog >= 0;
}

function isValidTimestamp(row) {
  return (
    Boolean(row.timestamp) &&
    !Number.isNaN(new Date(row.timestamp).getTime())
  );
}

function isValidAIS(row) {
  return (
    Boolean(row.mmsi) &&
    isValidCoordinates(row) &&
    isValidSpeed(row) &&
    isValidTimestamp(row)
  );
}

/* =========================================================
   SETTINGS COMPONENT
========================================================= */

export default function Settings() {
  const [aisData, setAisData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadAIS() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(AIS_FILE, {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(
            `Unable to load AIS_file.csv. HTTP ${response.status}`
          );
        }

        const text = await response.text();
        const parsed = parseCSV(text);

        const normalized = parsed
          .map(normalizeAISRow)
          .filter(
            (row) =>
              row.mmsi ||
              row.timestamp ||
              Number.isFinite(row.sog)
          );

        if (!normalized.length) {
          throw new Error(
            "AIS_file.csv contains no usable records."
          );
        }

        if (mounted) {
          setAisData(normalized);
        }
      } catch (err) {
        console.error("Settings AIS loading error:", err);

        if (mounted) {
          setError(
            err.message ||
              "Failed to load AIS_file.csv."
          );
          setAisData([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadAIS();

    return () => {
      mounted = false;
    };
  }, []);

  /* =======================================================
     DERIVED AIS METRICS
  ======================================================= */

  const metrics = useMemo(() => {
    const total = aisData.length;

    const valid = aisData.filter(isValidAIS);

    const invalid = aisData.filter(
      (row) => !isValidAIS(row)
    );

    const moving = valid.filter(
      (row) => row.sog > 0
    );

    const stationary = valid.filter(
      (row) => row.sog === 0
    );

    const vesselSet = new Set(
      aisData
        .map((row) => row.mmsi)
        .filter(Boolean)
    );

    const vesselTypeSet = new Set(
      aisData
        .map(
          (row) =>
            row.vesselType || "Unknown"
        )
        .filter(Boolean)
    );

    const speeds = valid
      .map((row) => row.sog)
      .filter(Number.isFinite);

    const averageSOG =
      speeds.length > 0
        ? speeds.reduce(
            (sum, value) => sum + value,
            0
          ) / speeds.length
        : 0;

    const health =
      total > 0
        ? (valid.length / total) * 100
        : 0;

    const latestTimestamp = aisData
      .map((row) => row.timestamp)
      .filter(Boolean)
      .sort(
        (a, b) =>
          new Date(b).getTime() -
          new Date(a).getTime()
      )[0] || "Unavailable";

    return {
      total,
      valid: valid.length,
      invalid: invalid.length,
      moving: moving.length,
      stationary: stationary.length,
      vessels: vesselSet.size,
      vesselTypes: vesselTypeSet.size,
      averageSOG,
      health,
      latestTimestamp,
    };
  }, [aisData]);

  /* =======================================================
     DATA STATUS
  ======================================================= */

  const dataStatus = useMemo(() => {
    if (!aisData.length) {
      return "No Data";
    }

    if (metrics.health >= 98) {
      return "Healthy";
    }

    if (metrics.health >= 90) {
      return "Review Required";
    }

    return "Critical";
  }, [aisData.length, metrics.health]);

  const statusColor =
    dataStatus === "Healthy"
      ? "#16a34a"
      : dataStatus === "Review Required"
      ? "#f59e0b"
      : dataStatus === "Critical"
      ? "#dc2626"
      : "#6b7280";

  return (
    <div className="page">

      {/* ================= HEADER ================= */}

      <h2>System Settings</h2>

      {loading && (
        <div className="card">
          <p style={{ color: "#000000" }}>
            Loading AIS configuration...
          </p>
        </div>
      )}

      {error && (
        <div
          className="card"
          style={{
            border: "1px solid #dc2626",
          }}
        >
          <p style={{ color: "#dc2626" }}>
            {error}
          </p>

          <p style={{ color: "#000000" }}>
            Make sure <b>AIS_file.csv</b> is inside{" "}
            <b>frontend/public/</b>.
          </p>
        </div>
      )}

      {/* ================= DATA SOURCE OVERVIEW ================= */}

      <div className="card">
        <h3>Data Source Overview</h3>

        <p style={{ color: "#000000" }}>
          <b>Data Source:</b> AIS_file.csv
        </p>

        <p style={{ color: "#000000" }}>
          <b>Data Type:</b> AIS Maritime Telemetry
        </p>

        <p style={{ color: "#000000" }}>
          <b>Total Records:</b>{" "}
          {metrics.total.toLocaleString()}
        </p>

        <p style={{ color: "#000000" }}>
          <b>Unique Vessels:</b>{" "}
          {metrics.vessels.toLocaleString()}
        </p>

        <p style={{ color: "#000000" }}>
          <b>Vessel Types:</b>{" "}
          {metrics.vesselTypes.toLocaleString()}
        </p>

        <p style={{ color: "#000000" }}>
          <b>Latest Timestamp:</b>{" "}
          {metrics.latestTimestamp}
        </p>

        <p style={{ color: "#000000" }}>
          <b>Data Status:</b>{" "}
          <span
            style={{
              color: statusColor,
              fontWeight: 700,
            }}
          >
            {dataStatus}
          </span>
        </p>
      </div>

      {/* ================= AIS CONFIGURATION STATUS ================= */}

      <div className="card">
        <h3>AIS Configuration Status</h3>

        <p style={{ color: "#000000" }}>
          📡 AIS Telemetry Loading:{" "}
          <b>
            {loading ? "Loading" : "Active"}
          </b>
        </p>

        <p style={{ color: "#000000" }}>
          🛰 Position Data:{" "}
          <b>
            {metrics.valid > 0
              ? "Available"
              : "Unavailable"}
          </b>
        </p>

        <p style={{ color: "#000000" }}>
          🚢 Vessel Tracking:{" "}
          <b>
            {metrics.vessels > 0
              ? "Available"
              : "Unavailable"}
          </b>
        </p>

        <p style={{ color: "#000000" }}>
          📊 Speed / SOG Data:{" "}
          <b>
            {metrics.valid > 0
              ? "Available"
              : "Unavailable"}
          </b>
        </p>

        <p style={{ color: "#000000" }}>
          🔄 Dataset Validation:{" "}
          <b>
            {metrics.invalid === 0
              ? "Passed"
              : "Review Required"}
          </b>
        </p>
      </div>

      {/* ================= TELEMETRY SUMMARY ================= */}

      <div className="card">
        <h3>Telemetry Configuration Summary</h3>

        <p style={{ color: "#000000" }}>
          <b>Valid AIS Records:</b>{" "}
          {metrics.valid.toLocaleString()}
        </p>

        <p style={{ color: "#000000" }}>
          <b>Validation Exceptions:</b>{" "}
          {metrics.invalid.toLocaleString()}
        </p>

        <p style={{ color: "#000000" }}>
          <b>Moving Records:</b>{" "}
          {metrics.moving.toLocaleString()}
        </p>

        <p style={{ color: "#000000" }}>
          <b>Stationary Records:</b>{" "}
          {metrics.stationary.toLocaleString()}
        </p>

        <p style={{ color: "#000000" }}>
          <b>Average SOG:</b>{" "}
          {metrics.averageSOG.toFixed(2)}
        </p>

        <p style={{ color: "#000000" }}>
          <b>Overall Data Health:</b>{" "}
          {metrics.health.toFixed(1)}%
        </p>
      </div>

      {/* ================= SYSTEM HEALTH ================= */}

      <div className="card">
        <h3>System Health Summary</h3>

        <p style={{ color: "#000000" }}>
          🟢 Overall Data Status:{" "}
          <b style={{ color: statusColor }}>
            {dataStatus}
          </b>
        </p>

        <p style={{ color: "#000000" }}>
          ⚙️ AIS Records Processed:{" "}
          <b>
            {metrics.total.toLocaleString()}
          </b>
        </p>

        <p style={{ color: "#000000" }}>
          📊 Validity Rate:{" "}
          <b>
            {metrics.health.toFixed(1)}%
          </b>
        </p>

        <p style={{ color: "#000000" }}>
          🚢 Active Vessel Records:{" "}
          <b>
            {metrics.moving.toLocaleString()}
          </b>
        </p>

        <p style={{ color: "#000000" }}>
          ⚠️ Validation Exceptions:{" "}
          <b>
            {metrics.invalid.toLocaleString()}
          </b>
        </p>
      </div>

      {/* ================= SOURCE NOTE ================= */}

      <div className="card">
        <h3>Configuration Note</h3>

        <p style={{ color: "#000000" }}>
          This settings page is driven by the actual
          AIS_file.csv dataset. Environment version,
          region, uptime, API access, token expiry,
          RBAC, and notification settings are not
          fields contained in AIS_file.csv, so they
          are not presented as fabricated AIS values.
        </p>
      </div>

    </div>
  );
}
