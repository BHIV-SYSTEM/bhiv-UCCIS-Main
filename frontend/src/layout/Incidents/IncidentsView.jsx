import React, { useEffect, useMemo, useState } from "react";
import RebuildSprint from "../../layout/RebuildSprint";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts";

const AIS_FILE = "/AIS_file.csv";

const COLORS = [
  "#ef4444",
  "#22c55e",
  "#f59e0b",
  "#dc2626"
];

/* -----------------------------
   CSV parser
----------------------------- */
function parseCSV(text) {
  const rows = [];
  let row = [];
  let value = "";
  let quoted = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const next = text[i + 1];

    if (char === '"' && quoted && next === '"') {
      value += '"';
      i++;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === "," && !quoted) {
      row.push(value.trim());
      value = "";
    } else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && next === "\n") i++;
      row.push(value.trim());
      value = "";

      if (row.some((cell) => cell !== "")) {
        rows.push(row);
      }

      row = [];
    } else {
      value += char;
    }
  }

  if (value.length || row.length) {
    row.push(value.trim());
    if (row.some((cell) => cell !== "")) {
      rows.push(row);
    }
  }

  if (!rows.length) return [];

  const headers = rows[0].map((header) =>
    String(header || "")
      .replace(/^\uFEFF/, "")
      .trim()
      .toLowerCase()
  );

  return rows.slice(1).map((cells) => {
    const item = {};
    headers.forEach((header, index) => {
      item[header] = cells[index] ?? "";
    });
    return item;
  });
}

function getField(row, names) {
  for (const name of names) {
    const key = name.toLowerCase();
    if (row[key] !== undefined && row[key] !== "") {
      return row[key];
    }
  }
  return "";
}

function normalizeAISRow(row, index) {
  const mmsi = getField(row, [
    "mmsi",
    "MMSI"
  ]);

  const timestamp = getField(row, [
    "basedatetime",
    "base_datetime",
    "base date time",
    "timestamp",
    "datetime",
    "time"
  ]);

  const latRaw = getField(row, [
    "lat",
    "latitude"
  ]);

  const lonRaw = getField(row, [
    "lon",
    "lng",
    "longitude"
  ]);

  const sogRaw = getField(row, [
    "sog",
    "speed over ground",
    "speed"
  ]);

  const vesselType = getField(row, [
    "vesseltype",
    "vessel type",
    "shiptype",
    "ship type",
    "type"
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

  const validTimestamp =
    timestamp !== "" &&
    !Number.isNaN(new Date(timestamp).getTime());

  const validMMSI = String(mmsi).trim() !== "";

  const valid = validMMSI && validCoordinates && validSOG && validTimestamp;

  return {
    id: `${mmsi || "AIS"}-${timestamp || index}-${index}`,
    mmsi: String(mmsi || "Unknown"),
    timestamp: timestamp || "Unknown",
    lat,
    lon,
    sog,
    vesselType: String(vesselType || "Unknown"),
    validCoordinates,
    validSOG,
    validTimestamp,
    validMMSI,
    valid
  };
}

function formatDate(value) {
  if (!value || value === "Unknown") return "Unknown";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString();
}

function getStatus(row) {
  if (!row.valid) return "Critical";

  // High-speed valid records are treated as critical operational activity.
  if (row.sog >= 20) return "Critical";

  // Stationary vessels represent open operational activity.
  if (row.sog === 0) return "Open";

  // Valid moving vessels are treated as closed/processed activity.
  return "Closed";
}

function getSeverity(row) {
  if (!row.valid || row.sog >= 20) return "Critical";
  if (row.sog === 0) return "High";
  return "Medium";
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div
      style={{
        background: "#111827",
        border: "1px solid #374151",
        borderRadius: 6,
        padding: "10px 12px",
        color: "#ffffff"
      }}
    >
      {label && (
        <div style={{ color: "#ffffff", marginBottom: 5 }}>
          {label}
        </div>
      )}

      {payload.map((item, index) => (
        <div
          key={index}
          style={{
            color: "#ffffff",
            marginBottom: 2
          }}
        >
          {item.name}: {Number(item.value).toLocaleString()}
        </div>
      ))}
    </div>
  );
}

export default function IncidentsView() {
  const [aisRows, setAisRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadAIS() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(AIS_FILE, {
          cache: "no-store"
        });

        if (!response.ok) {
          throw new Error(
            `Unable to load AIS_file.csv (${response.status})`
          );
        }

        const csvText = await response.text();
        const parsed = parseCSV(csvText);

        const normalized = parsed.map(normalizeAISRow);

        if (!cancelled) {
          setAisRows(normalized);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Failed to load AIS data.");
          setAisRows([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadAIS();

    return () => {
      cancelled = true;
    };
  }, []);

  const metrics = useMemo(() => {
    const total = aisRows.length;

    const valid = aisRows.filter((row) => row.valid);

    const invalid = aisRows.filter((row) => !row.valid);

    const moving = valid.filter((row) => row.sog > 0);

    const stationary = valid.filter((row) => row.sog === 0);

    const critical = aisRows.filter(
      (row) => !row.valid || row.sog >= 20
    );

    // Status categories are deliberately mutually exclusive.
    const closed = valid.filter(
      (row) => row.sog > 0 && row.sog < 20
    );

    const criticalStatus = aisRows.filter(
      (row) => !row.valid || row.sog >= 20
    );

    const open = stationary;

    const pending = invalid;

    const uniqueVessels = new Set(
      aisRows
        .map((row) => row.mmsi)
        .filter((mmsi) => mmsi && mmsi !== "Unknown")
    ).size;

    return {
      total,
      valid: valid.length,
      invalid: invalid.length,
      moving: moving.length,
      stationary: stationary.length,
      critical: critical.length,
      open: open.length,
      closed: closed.length,
      pending: pending.length,
      criticalStatus: criticalStatus.length,
      uniqueVessels
    };
  }, [aisRows]);

  const incidentStatus = useMemo(
    () => [
      { name: "Open", value: metrics.open },
      { name: "Closed", value: metrics.closed },
      { name: "Pending", value: metrics.pending },
      { name: "Critical", value: metrics.criticalStatus }
    ],
    [metrics]
  );

  const incidentDomain = useMemo(() => {
    const counts = {};

    aisRows.forEach((row) => {
      const type = row.vesselType || "Unknown";
      counts[type] = (counts[type] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([domain, count]) => ({
        domain,
        count
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [aisRows]);

  const backendResponse = useMemo(() => {
    return [...aisRows]
      .sort((a, b) => {
        const aTime = new Date(a.timestamp).getTime();
        const bTime = new Date(b.timestamp).getTime();

        if (Number.isNaN(aTime)) return 1;
        if (Number.isNaN(bTime)) return -1;

        return bTime - aTime;
      })
      .slice(0, 10)
      .map((row) => ({
        incidentId: `AIS-${row.mmsi}`,
        traceId: row.id,
        vesselType: row.vesselType,
        severity: getSeverity(row),
        status: getStatus(row),
        timestamp: row.timestamp
      }));
  }, [aisRows]);

  return (
    <RebuildSprint>
      <h2>Incident Management</h2>

      {error && (
        <div
          style={{
            background: "#fee2e2",
            border: "1px solid #ef4444",
            color: "#991b1b",
            padding: "12px 14px",
            borderRadius: 6,
            marginBottom: 16
          }}
        >
          {error}
        </div>
      )}

      <div className="card-grid">
        <div className="kpi-card">
          <h4>Total Incidents</h4>
          <h2 style={{ color: "#ffffff" }}>
            {loading ? "..." : metrics.total.toLocaleString()}
          </h2>
        </div>

        <div className="kpi-card">
          <h4>Open</h4>
          <h2 style={{ color: "#ffffff" }}>
            {loading ? "..." : metrics.open.toLocaleString()}
          </h2>
        </div>

        <div className="kpi-card">
          <h4>Closed</h4>
          <h2 style={{ color: "#ffffff" }}>
            {loading ? "..." : metrics.closed.toLocaleString()}
          </h2>
        </div>

        <div className="kpi-card">
          <h4>Critical</h4>
          <h2 style={{ color: "#ffffff" }}>
            {loading ? "..." : metrics.criticalStatus.toLocaleString()}
          </h2>
        </div>
      </div>

      <div className="dashboard-two-column">
        <div className="card">
          <h3>Incident Status Distribution</h3>

          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={incidentStatus}
                dataKey="value"
                nameKey="name"
                outerRadius={120}
                label
              >
                {incidentStatus.map((entry, index) => (
                  <Cell
                    key={entry.name}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>

              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3>Incidents By Vessel Type</h3>

          <ResponsiveContainer width="100%" height={350}>
            <BarChart
              data={incidentDomain}
              margin={{
                top: 20,
                right: 20,
                left: 20,
                bottom: 35
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis
                dataKey="domain"
                label={{
                  value: "Vessel Type",
                  position: "insideBottom",
                  offset: -20
                }}
              />

              <YAxis
                allowDecimals={false}
                label={{
                  value: "AIS Record Count",
                  angle: -90,
                  position: "insideLeft"
                }}
              />

              <Tooltip content={<CustomTooltip />} />

              <Bar
                dataKey="count"
                name="AIS Records"
                fill="#2563eb"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <h3>Recent AIS Incident Activity</h3>

        <table className="uccis-table">
          <thead>
            <tr>
              <th>Incident ID</th>
              <th>Trace ID</th>
              <th>Vessel Type</th>
              <th>Severity</th>
              <th>Status</th>
              <th>Timestamp</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan="6"
                  style={{
                    color: "#000000",
                    textAlign: "center"
                  }}
                >
                  Loading AIS data...
                </td>
              </tr>
            ) : backendResponse.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  style={{
                    color: "#000000",
                    textAlign: "center"
                  }}
                >
                  No AIS incident activity found.
                </td>
              </tr>
            ) : (
              backendResponse.map((item) => (
                <tr key={item.traceId}>
                  <td style={{ color: "#000000" }}>
                    {item.incidentId}
                  </td>

                  <td style={{ color: "#000000" }}>
                    {item.traceId}
                  </td>

                  <td style={{ color: "#000000" }}>
                    {item.vesselType}
                  </td>

                  <td style={{ color: "#000000" }}>
                    {item.severity}
                  </td>

                  <td style={{ color: "#000000" }}>
                    {item.status}
                  </td>

                  <td style={{ color: "#000000" }}>
                    {formatDate(item.timestamp)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="card">
        <h3>AIS Incident Metrics</h3>

        <div className="card-grid">
          <div className="kpi-card">
            <h4>Valid AIS Records</h4>
            <h2 style={{ color: "#000000" }}>
              {metrics.valid.toLocaleString()}
            </h2>
          </div>

          <div className="kpi-card">
            <h4>Stationary Activity</h4>
            <h2 style={{ color: "#000000" }}>
              {metrics.stationary.toLocaleString()}
            </h2>
          </div>

          <div className="kpi-card">
            <h4>Validation Failures</h4>
            <h2 style={{ color: "#000000" }}>
              {metrics.invalid.toLocaleString()}
            </h2>
          </div>

          <div className="kpi-card">
            <h4>Unique Vessels</h4>
            <h2 style={{ color: "#000000" }}>
              {metrics.uniqueVessels.toLocaleString()}
            </h2>
          </div>
        </div>
      </div>
    </RebuildSprint>
  );
}
