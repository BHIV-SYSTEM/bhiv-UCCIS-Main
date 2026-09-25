import React, { useEffect, useMemo, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const AIS_FILE = "/AIS_file.csv";

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
      if (row.some((cell) => cell !== "")) rows.push(row);
      row = [];
    } else {
      value += char;
    }
  }

  if (value.length || row.length) {
    row.push(value.trim());
    if (row.some((cell) => cell !== "")) rows.push(row);
  }

  if (!rows.length) return [];

  const headers = rows[0].map((header) =>
    String(header || "").replace(/^\uFEFF/, "").trim().toLowerCase()
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
    if (row[key] !== undefined && row[key] !== null && row[key] !== "") {
      return row[key];
    }
  }
  return "";
}

function normalizeAISRow(row, index) {
  const mmsi = getField(row, ["mmsi"]);
  const timestamp = getField(row, [
    "basedatetime",
    "base_datetime",
    "base date time",
    "timestamp",
    "datetime",
    "time",
  ]);
  const lat = Number(getField(row, ["lat", "latitude"]));
  const lon = Number(getField(row, ["lon", "lng", "longitude"]));
  const sog = Number(getField(row, ["sog", "speed over ground", "speed"]));
  const vesselType = getField(row, [
    "vesseltype",
    "vessel type",
    "shiptype",
    "ship type",
    "type",
  ]);

  const validMMSI = String(mmsi).trim() !== "";
  const validCoordinates =
    Number.isFinite(lat) &&
    Number.isFinite(lon) &&
    lat >= -90 &&
    lat <= 90 &&
    lon >= -180 &&
    lon <= 180;
  const validSOG = Number.isFinite(sog) && sog >= 0;
  const date = timestamp ? new Date(timestamp) : null;
  const validTimestamp = date && !Number.isNaN(date.getTime());

  return {
    id: `AIS-${index + 1}`,
    mmsi: String(mmsi || "Unknown"),
    timestamp: timestamp || "Unknown",
    date: validTimestamp ? date : null,
    lat,
    lon,
    sog,
    vesselType: String(vesselType || "Unknown"),
    valid: validMMSI && validCoordinates && validSOG && validTimestamp,
  };
}

function getPriority(row) {
  if (!row.valid) return "P1";
  if (row.sog === 0) return "P2";
  return "P3";
}

function getLevel(row) {
  if (!row.valid) return "L3";
  if (row.sog === 0) return "L2";
  return "L1";
}

function getStatus(row) {
  if (!row.valid) return "Active";
  if (row.sog === 0) return "Pending";
  return "Resolved";
}

function getOwner(row) {
  if (!row.valid) return "AIS Validation Team";
  if (row.sog === 0) return "Vessel Monitoring Team";
  return "AIS Processing Team";
}

function getReason(row) {
  if (!row.valid) return "AIS telemetry validation exception";
  if (row.sog === 0) return "Stationary vessel activity detected";
  return "Active vessel telemetry processed";
}

function formatDate(value) {
  if (!value || value === "Unknown") return "Unknown";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString();
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div
      style={{
        background: "#111827",
        border: "1px solid #374151",
        borderRadius: "6px",
        padding: "10px 12px",
        color: "#ffffff",
      }}
    >
      {label && (
        <div style={{ color: "#ffffff", fontWeight: 600, marginBottom: 5 }}>
          {label}
        </div>
      )}
      {payload.map((item, index) => (
        <div key={index} style={{ color: "#ffffff" }}>
          {item.name}:{" "}
          {typeof item.value === "number"
            ? item.value.toLocaleString()
            : item.value}
        </div>
      ))}
    </div>
  );
}

export default function Escalations() {
  const [aisRows, setAisRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadAIS() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(AIS_FILE, { cache: "no-store" });

        if (!response.ok) {
          throw new Error(`Unable to load AIS_file.csv (${response.status})`);
        }

        const csvText = await response.text();
        const normalized = parseCSV(csvText).map(normalizeAISRow);

        if (!cancelled) setAisRows(normalized);
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Failed to load AIS data.");
          setAisRows([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadAIS();

    return () => {
      cancelled = true;
    };
  }, []);

  const escalations = useMemo(() => {
    return [...aisRows]
      .sort((a, b) => (b.date?.getTime() || 0) - (a.date?.getTime() || 0))
      .slice(0, 25)
      .map((row) => ({
        id: `ESC-${row.mmsi}-${row.id.replace("AIS-", "")}`,
        traceId: row.id,
        level: getLevel(row),
        owner: getOwner(row),
        status: getStatus(row),
        priority: getPriority(row),
        reason: getReason(row),
        createdAt: row.timestamp,
        mmsi: row.mmsi,
        vesselType: row.vesselType,
        sog: row.sog,
        lat: row.lat,
        lon: row.lon,
        valid: row.valid,
      }));
  }, [aisRows]);

  const stats = useMemo(() => ({
    total: aisRows.length,
    active: aisRows.filter((r) => !r.valid).length,
    resolved: aisRows.filter((r) => r.valid && r.sog > 0).length,
    pending: aisRows.filter((r) => r.valid && r.sog === 0).length,
  }), [aisRows]);

  const pieData = useMemo(() => [
    { name: "Active", value: stats.active },
    { name: "Resolved", value: stats.resolved },
    { name: "Pending", value: stats.pending },
  ], [stats]);

  const pieColors = ["#ef4444", "#22c55e", "#f59e0b"];

  const barData = useMemo(() => [
    { name: "L1", value: aisRows.filter((r) => r.valid && r.sog > 0).length },
    { name: "L2", value: aisRows.filter((r) => r.valid && r.sog === 0).length },
    { name: "L3", value: aisRows.filter((r) => !r.valid).length },
  ], [aisRows]);

  const barColors = ["#3b82f6", "#f59e0b", "#ef4444"];

  return (
    <div className="page">
      <h2>AIS Escalations</h2>

      {error && (
        <div
          style={{
            background: "#fee2e2",
            border: "1px solid #ef4444",
            color: "#991b1b",
            padding: "12px 14px",
            borderRadius: "6px",
            marginBottom: "16px",
          }}
        >
          {error}
        </div>
      )}

      <div className="grid">
        <div className="card">
          <h3>Total</h3>
          <h1 style={{ color: "#ffffff" }}>
            {loading ? "..." : stats.total.toLocaleString()}
          </h1>
        </div>
        <div className="card">
          <h3>Active</h3>
          <h1 style={{ color: "#ffffff" }}>
            {loading ? "..." : stats.active.toLocaleString()}
          </h1>
        </div>
        <div className="card">
          <h3>Resolved</h3>
          <h1 style={{ color: "#ffffff" }}>
            {loading ? "..." : stats.resolved.toLocaleString()}
          </h1>
        </div>
        <div className="card">
          <h3>Pending</h3>
          <h1 style={{ color: "#ffffff" }}>
            {loading ? "..." : stats.pending.toLocaleString()}
          </h1>
        </div>
      </div>

      <div className="grid">
        <div className="card">
          <h3>AIS Escalation List</h3>

          {loading ? (
            <p style={{ color: "#ffffff" }}>Loading AIS data...</p>
          ) : escalations.length === 0 ? (
            <p style={{ color: "#ffffff" }}>No AIS escalation records found.</p>
          ) : (
            escalations.map((e) => (
              <div
                key={e.traceId}
                className="card"
                style={{ marginBottom: "10px", color: "#000000" }}
              >
                <b>{e.id}</b>
                <p>Level: {e.level}</p>
                <p>MMSI: {e.mmsi}</p>
                <p>Vessel Type: {e.vesselType}</p>
                <p>Owner: {e.owner}</p>
                <p>Status: {e.status}</p>
                <p>Priority: {e.priority}</p>
                <p>Reason: {e.reason}</p>
                <p>SOG: {Number.isFinite(e.sog) ? e.sog.toFixed(2) : "Invalid"}</p>
                <p>Created: {formatDate(e.createdAt)}</p>
              </div>
            ))
          )}
        </div>

        <div className="card">
          <h3>AIS Escalation Status Distribution</h3>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                {pieData.map((_, index) => (
                  <Cell key={index} fill={pieColors[index]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <h3>AIS Escalation Level Distribution</h3>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={barData}
            margin={{ top: 20, right: 20, left: 20, bottom: 45 }}
          >
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
              dataKey="name"
              label={{
                value: "Escalation Level",
                position: "insideBottom",
                offset: -20,
              }}
            />

            <YAxis
              allowDecimals={false}
              label={{
                value: "AIS Record Count",
                angle: -90,
                position: "insideLeft",
              }}
            />

            <Tooltip content={<CustomTooltip />} />

            <Bar dataKey="value" name="AIS Records">
              {barData.map((_, index) => (
                <Cell key={index} fill={barColors[index]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="card">
        <h3>AIS Escalation Response</h3>

        <div style={{ width: "100%", overflowX: "auto" }}>
          <table
            className="uccis-table"
            style={{ width: "100%", minWidth: "1100px" }}
          >
            <thead>
              <tr>
                <th>Escalation ID</th>
                <th>Trace ID</th>
                <th>Vessel Type</th>
                <th>Priority</th>
                <th>Assigned To</th>
                <th>Status</th>
                <th>SOG</th>
                <th>Timestamp</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="8"
                    style={{
                      color: "#000000",
                      textAlign: "center",
                      padding: "18px",
                    }}
                  >
                    Loading AIS data...
                  </td>
                </tr>
              ) : escalations.length === 0 ? (
                <tr>
                  <td
                    colSpan="8"
                    style={{
                      color: "#000000",
                      textAlign: "center",
                      padding: "18px",
                    }}
                  >
                    No AIS escalation records found.
                  </td>
                </tr>
              ) : (
                escalations.slice(0, 15).map((item) => (
                  <tr key={`${item.traceId}-table`}>
                    <td style={{ color: "#000000" }}>{item.id}</td>
                    <td style={{ color: "#000000" }}>{item.traceId}</td>
                    <td style={{ color: "#000000" }}>{item.vesselType}</td>
                    <td style={{ color: "#000000" }}>{item.priority}</td>
                    <td style={{ color: "#000000" }}>{item.owner}</td>
                    <td style={{ color: "#000000" }}>{item.status}</td>
                    <td style={{ color: "#000000" }}>
                      {Number.isFinite(item.sog) ? item.sog.toFixed(2) : "Invalid"}
                    </td>
                    <td style={{ color: "#000000" }}>
                      {formatDate(item.createdAt)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
