import React, { useEffect, useMemo, useState } from "react";

const AIS_FILE = "/AIS_file.csv";

// --------------------------------------------------
// CSV Parser
// --------------------------------------------------
function parseCSV(text) {
  const lines = text
    .replace(/\r/g, "")
    .split("\n")
    .filter((line) => line.trim());

  if (lines.length < 2) return [];

  const headers = lines[0]
    .split(",")
    .map((h) => h.trim().replace(/^"|"$/g, ""));

  return lines.slice(1).map((line) => {
    const values = [];
    let current = "";
    let insideQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"') {
        insideQuotes = !insideQuotes;
      } else if (char === "," && !insideQuotes) {
        values.push(current.trim().replace(/^"|"$/g, ""));
        current = "";
      } else {
        current += char;
      }
    }

    values.push(current.trim().replace(/^"|"$/g, ""));

    const row = {};

    headers.forEach((header, index) => {
      row[header] = values[index] ?? "";
    });

    return row;
  });
}

// --------------------------------------------------
// Get value from different possible AIS column names
// --------------------------------------------------
function getField(row, names) {
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
}

// --------------------------------------------------
// Number conversion
// --------------------------------------------------
function toNumber(value) {
  const number = Number.parseFloat(value);
  return Number.isFinite(number) ? number : null;
}

// --------------------------------------------------
// Normalize AIS record
// --------------------------------------------------
function normalizeAIS(row, index) {
  const mmsi = getField(row, [
    "MMSI",
    "mmsi",
    "Mmsi",
    "Vessel MMSI",
  ]);

  const latitude = toNumber(
    getField(row, [
      "Latitude",
      "latitude",
      "LAT",
      "lat",
      "LATITUDE",
    ])
  );

  const longitude = toNumber(
    getField(row, [
      "Longitude",
      "longitude",
      "LON",
      "lon",
      "LONGITUDE",
    ])
  );

  const sog = toNumber(
    getField(row, [
      "SOG",
      "sog",
      "Speed",
      "speed",
      "Speed Over Ground",
    ])
  );

  const timestamp = getField(row, [
    "Timestamp",
    "timestamp",
    "TIME",
    "time",
    "BaseDateTime",
    "datetime",
    "DateTime",
  ]);

  return {
    id: index + 1,
    mmsi: String(mmsi || `UNKNOWN-${index + 1}`),
    latitude,
    longitude,
    sog,
    timestamp,
    validCoordinates:
      latitude !== null &&
      longitude !== null &&
      latitude >= -90 &&
      latitude <= 90 &&
      longitude >= -180 &&
      longitude <= 180,
    validSpeed: sog !== null && sog >= 0,
    moving: sog !== null && sog > 0,
    stationary: sog !== null && sog === 0,
  };
}

// --------------------------------------------------
// Build Runtime Logs
// --------------------------------------------------
function buildRuntimeLogs(records) {
  if (!records.length) {
    return [
      {
        id: "system-empty",
        source: "SYSTEM",
        message: "No AIS telemetry records available.",
      },
    ];
  }

  const total = records.length;

  const validTelemetry = records.filter(
    (record) => record.validCoordinates && record.validSpeed
  ).length;

  const moving = records.filter((record) => record.moving).length;

  const stationary = records.filter(
    (record) => record.stationary
  ).length;

  const invalid = records.filter(
    (record) => !record.validCoordinates || !record.validSpeed
  ).length;

  const uniqueVessels = new Set(
    records
      .map((record) => record.mmsi)
      .filter(Boolean)
  ).size;

  const latestRecord = records[records.length - 1];

  return [
    {
      id: "ais-received",
      source: "AIS",
      message: `${total.toLocaleString()} AIS telemetry records received.`,
    },
    {
      id: "telemetry-processed",
      source: "TELEMETRY",
      message: `${validTelemetry.toLocaleString()} valid telemetry records processed.`,
    },
    {
      id: "vessel-activity",
      source: "MONITORING",
      message: `${moving.toLocaleString()} moving vessel records detected.`,
    },
    {
      id: "stationary-activity",
      source: "MONITORING",
      message: `${stationary.toLocaleString()} stationary vessel records detected.`,
    },
    {
      id: "vessel-count",
      source: "VESSEL",
      message: `${uniqueVessels.toLocaleString()} unique vessels represented in the dataset.`,
    },
    {
      id: "validation",
      source: "VALIDATION",
      message:
        invalid > 0
          ? `${invalid.toLocaleString()} telemetry records require validation.`
          : "All telemetry records passed validation.",
    },
    {
      id: "runtime",
      source: "RUNTIME",
      message:
        latestRecord?.timestamp
          ? `Latest telemetry timestamp: ${latestRecord.timestamp}.`
          : "Runtime telemetry monitoring is active.",
    },
  ];
}

// --------------------------------------------------
// Runtime Logs Component
// --------------------------------------------------
function RuntimeLogs({ logs = [], data = [] }) {
  const runtimeLogs = logs.length ? logs : data;

  const [aisRecords, setAisRecords] = useState([]);
  const [loadingAIS, setLoadingAIS] = useState(true);
  const [aisError, setAisError] = useState("");

  // ------------------------------------------------
  // Load AIS data
  // ------------------------------------------------
  const loadAISData = async () => {
    try {
      setAisError("");

      const response = await fetch(
        `${AIS_FILE}?t=${Date.now()}`
      );

      if (!response.ok) {
        throw new Error(
          `AIS file request failed: ${response.status}`
        );
      }

      const text = await response.text();

      const parsed = parseCSV(text);

      const normalized = parsed.map(normalizeAIS);

      setAisRecords(normalized);
    } catch (error) {
      console.error("RuntimeLogs AIS error:", error);

      setAisError("Unable to load AIS telemetry.");
    } finally {
      setLoadingAIS(false);
    }
  };

  useEffect(() => {
    loadAISData();

    const interval = setInterval(() => {
      loadAISData();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // ------------------------------------------------
  // Use existing logs if available.
  // Otherwise generate logs from AIS.
  // ------------------------------------------------
  const displayLogs = useMemo(() => {
    if (runtimeLogs.length > 0) {
      return runtimeLogs;
    }

    return buildRuntimeLogs(aisRecords);
  }, [runtimeLogs, aisRecords]);

  // ------------------------------------------------
  // AIS summary
  // ------------------------------------------------
  const aisSummary = useMemo(() => {
    if (!aisRecords.length) {
      return {
        total: 0,
        moving: 0,
        stationary: 0,
        invalid: 0,
      };
    }

    return {
      total: aisRecords.length,

      moving: aisRecords.filter(
        (record) => record.moving
      ).length,

      stationary: aisRecords.filter(
        (record) => record.stationary
      ).length,

      invalid: aisRecords.filter(
        (record) =>
          !record.validCoordinates ||
          !record.validSpeed
      ).length,
    };
  }, [aisRecords]);

  return (
    <div className="uccis-card">
      <h3>📄 Runtime Logs</h3>

      {/* --------------------------------------------
          AIS Status
      --------------------------------------------- */}
      {!runtimeLogs.length && (
        <div
          style={{
            marginBottom: "12px",
            padding: "8px 12px",
            borderRadius: "6px",
            background: aisError
              ? "#fee2e2"
              : "#ecfdf5",
            color: aisError
              ? "#991b1b"
              : "#065f46",
            fontSize: "12px",
            fontWeight: 600,
          }}
        >
          {loadingAIS
            ? "Loading AIS runtime telemetry..."
            : aisError
            ? aisError
            : "✓ Runtime logs generated from AIS telemetry"}
        </div>
      )}

      {/* --------------------------------------------
          AIS Quick Metrics
      --------------------------------------------- */}
      {!runtimeLogs.length && aisRecords.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(4, minmax(0, 1fr))",
            gap: "8px",
            marginBottom: "14px",
          }}
        >
          <div
            style={{
              padding: "8px",
              background: "#f3f4f6",
              borderRadius: "6px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: "11px",
                color: "#6b7280",
              }}
            >
              Records
            </div>

            <strong
              style={{
                fontSize: "16px",
                color: "#111827",
              }}
            >
              {aisSummary.total.toLocaleString()}
            </strong>
          </div>

          <div
            style={{
              padding: "8px",
              background: "#f3f4f6",
              borderRadius: "6px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: "11px",
                color: "#6b7280",
              }}
            >
              Moving
            </div>

            <strong
              style={{
                fontSize: "16px",
                color: "#111827",
              }}
            >
              {aisSummary.moving.toLocaleString()}
            </strong>
          </div>

          <div
            style={{
              padding: "8px",
              background: "#f3f4f6",
              borderRadius: "6px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: "11px",
                color: "#6b7280",
              }}
            >
              Stationary
            </div>

            <strong
              style={{
                fontSize: "16px",
                color: "#111827",
              }}
            >
              {aisSummary.stationary.toLocaleString()}
            </strong>
          </div>

          <div
            style={{
              padding: "8px",
              background: "#f3f4f6",
              borderRadius: "6px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: "11px",
                color: "#6b7280",
              }}
            >
              Validation
            </div>

            <strong
              style={{
                fontSize: "16px",
                color: "#111827",
              }}
            >
              {aisSummary.invalid.toLocaleString()}
            </strong>
          </div>
        </div>
      )}

      {/* --------------------------------------------
          Logs
      --------------------------------------------- */}
      <div className="logs-box">
        {loadingAIS &&
        !runtimeLogs.length &&
        !aisRecords.length ? (
          <p>Loading runtime logs...</p>
        ) : displayLogs.length === 0 ? (
          <p>No runtime logs available.</p>
        ) : (
          displayLogs.map((log, index) => (
            <div
              key={log.id || index}
              className="log-line"
            >
              <strong>
                [{log.source || log.module || "SYSTEM"}]
              </strong>{" "}
              {log.message || "No message"}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default RuntimeLogs;