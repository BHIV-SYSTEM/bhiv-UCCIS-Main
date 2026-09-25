import React, { useEffect, useMemo, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

const AIS_FILE = "/AIS_file.csv";

function parseCSV(text) {
  const rows = [];
  let row = [], value = "", quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i], n = text[i + 1];
    if (c === '"' && quoted && n === '"') { value += '"'; i++; }
    else if (c === '"') quoted = !quoted;
    else if (c === "," && !quoted) { row.push(value.trim()); value = ""; }
    else if ((c === "\n" || c === "\r") && !quoted) {
      if (c === "\r" && n === "\n") i++;
      row.push(value.trim()); value = "";
      if (row.some(x => x !== "")) rows.push(row);
      row = [];
    } else value += c;
  }
  if (value.length || row.length) { row.push(value.trim()); if (row.some(x => x !== "")) rows.push(row); }
  if (!rows.length) return [];
  const headers = rows[0].map(h => String(h || "").replace(/^\uFEFF/, "").trim().toLowerCase());
  return rows.slice(1).map(cells => Object.fromEntries(headers.map((h, i) => [h, cells[i] ?? ""])));
}

function getField(row, names) {
  for (const name of names) {
    const key = name.toLowerCase();
    if (row[key] !== undefined && row[key] !== null && row[key] !== "") return row[key];
  }
  return "";
}

function normalizeAISRow(row, index) {
  const mmsi = getField(row, ["mmsi"]);
  const timestamp = getField(row, ["basedatetime", "base_datetime", "base date time", "timestamp", "datetime", "time"]);
  const lat = Number(getField(row, ["lat", "latitude"]));
  const lon = Number(getField(row, ["lon", "lng", "longitude"]));
  const sog = Number(getField(row, ["sog", "speed over ground", "speed"]));
  const vesselType = getField(row, ["vesseltype", "vessel type", "shiptype", "ship type", "type"]);
  const date = timestamp ? new Date(timestamp) : null;
  const valid = String(mmsi).trim() !== "" && Number.isFinite(lat) && Number.isFinite(lon) && lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180 && Number.isFinite(sog) && sog >= 0 && date && !Number.isNaN(date.getTime());
  return { id: `AIS-${index + 1}`, mmsi: String(mmsi || "Unknown"), timestamp: timestamp || "Unknown", date: valid ? date : null, lat, lon, sog, vesselType: String(vesselType || "Unknown"), valid };
}

function formatDate(value) {
  if (!value || value === "Unknown") return "Unknown";
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? String(value) : d.toLocaleString();
}

function priority(row) {
  if (!row.valid) return "Critical";
  if (row.sog === 0) return "High";
  return "Medium";
}

function status(row) {
  if (!row.valid) return "Open";
  if (row.sog === 0) return "Investigating";
  return "Closed";
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return <div style={{ background: "#111827", border: "1px solid #374151", borderRadius: 6, padding: "10px 12px", color: "#fff" }}>
    {label && <div style={{ fontWeight: 600, marginBottom: 5 }}>{label}</div>}
    {payload.map((p, i) => <div key={i}>{p.name}: {typeof p.value === "number" ? p.value.toLocaleString() : p.value}</div>)}
  </div>;
}

export default function Incidents() {
  const [aisRows, setAisRows] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const response = await fetch(AIS_FILE, { cache: "no-store" });
        if (!response.ok) throw new Error(`Unable to load AIS_file.csv (${response.status})`);
        const parsed = parseCSV(await response.text()).map(normalizeAISRow);
        if (!cancelled) setAisRows(parsed);
      } catch (err) {
        if (!cancelled) { setError(err.message || "Failed to load AIS data."); setAisRows([]); }
      } finally { if (!cancelled) setLoading(false); }
    })();
    return () => { cancelled = true; };
  }, []);

  const metrics = useMemo(() => {
    const total = aisRows.length;
    const invalid = aisRows.filter(r => !r.valid).length;
    const stationary = aisRows.filter(r => r.valid && r.sog === 0).length;
    const moving = aisRows.filter(r => r.valid && r.sog > 0).length;
    const vessels = new Set(aisRows.map(r => r.mmsi).filter(x => x && x !== "Unknown")).size;
    return { total, invalid, stationary, moving, vessels, health: total ? (total - invalid) / total * 100 : 0 };
  }, [aisRows]);

  const incidents = useMemo(() => [...aisRows].sort((a, b) => (b.date?.getTime() || 0) - (a.date?.getTime() || 0)).slice(0, 25).map(r => ({
    ...r,
    incidentId: `INC-${r.mmsi}-${r.id.replace("AIS-", "")}`,
    title: !r.valid ? "AIS Validation Exception" : r.sog === 0 ? "Stationary Vessel Activity" : "Active Vessel Telemetry",
    priority: priority(r), status: status(r), owner: !r.valid ? "AIS Validation Team" : r.sog === 0 ? "Vessel Monitoring Team" : "AIS Processing Team",
    description: !r.valid ? "AIS validation exception detected for this telemetry record." : r.sog === 0 ? "Vessel is stationary according to AIS SOG." : "Valid moving AIS telemetry record."
  })), [aisRows]);

  const pieData = [
    { name: "Open", value: metrics.invalid },
    { name: "Investigating", value: metrics.stationary },
    { name: "Closed", value: metrics.moving }
  ];
  const pieColors = ["#3b82f6", "#f59e0b", "#22c55e"];
  const barData = [
    { name: "Critical", value: metrics.invalid },
    { name: "High", value: metrics.stationary },
    { name: "Medium", value: metrics.moving }
  ];
  const barColors = ["#a855f7", "#ef4444", "#f59e0b"];

  return <div className="page">
    <h2>AIS Incident & Operations</h2>
    {error && <div style={{ background: "#fee2e2", border: "1px solid #ef4444", color: "#991b1b", padding: "12px 14px", borderRadius: 6, marginBottom: 16 }}>{error}</div>}

    <div className="grid">
      {[
        ["Total AIS Records", metrics.total],
        ["Open / Exceptions", metrics.invalid],
        ["Critical AIS Records", metrics.invalid],
        ["Stationary / Investigating", metrics.stationary]
      ].map(([label, value]) => <div className="card" key={label}><h3>{label}</h3><h1 style={{ color: "#ffffff" }}>{loading ? "..." : value.toLocaleString()}</h1></div>)}
    </div>

    <div className="grid">
      <div className="card">
        <h3>AIS Operational Record List</h3>
        {loading ? <p style={{ color: "#000" }}>Loading AIS records...</p> : incidents.length === 0 ? <p style={{ color: "#000" }}>No AIS records found.</p> : incidents.map(item => <div key={item.id} className="card" onClick={() => setSelected(item)} style={{ cursor: "pointer", marginBottom: 10, color: "#000" }}>
          <b>{item.incidentId}</b><p>{item.title}</p><p>Vessel Type: {item.vesselType}</p><p>MMSI: {item.mmsi}</p><p>Priority: {item.priority}</p><p>Status: {item.status}</p><p>SOG: {Number.isFinite(item.sog) ? item.sog.toFixed(2) : "Invalid"}</p>
        </div>)}
      </div>

      <div className="card">
        <h3>AIS Operational Status Distribution</h3>
        <ResponsiveContainer width="100%" height={300}><PieChart><Pie data={pieData} dataKey="value" nameKey="name" outerRadius={100} label>{pieData.map((_, i) => <Cell key={i} fill={pieColors[i]} />)}</Pie><Tooltip content={<CustomTooltip />} /><Legend /></PieChart></ResponsiveContainer>
      </div>
    </div>

    <div className="card">
      <h3>AIS Operational Priority Distribution</h3>
      <ResponsiveContainer width="100%" height={300}><BarChart data={barData} margin={{ top: 20, right: 20, left: 20, bottom: 45 }}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" label={{ value: "Operational Priority", position: "insideBottom", offset: -20 }} /><YAxis allowDecimals={false} label={{ value: "AIS Record Count", angle: -90, position: "insideLeft" }} /><Tooltip content={<CustomTooltip />} /><Bar dataKey="value" name="AIS Records">{barData.map((_, i) => <Cell key={i} fill={barColors[i]} />)}</Bar></BarChart></ResponsiveContainer>
    </div>

    {selected && <div className="card">
      <h3>AIS Operational Record Details</h3>
      <p style={{ color: "#000" }}><b>Incident ID:</b> {selected.incidentId}</p>
      <p style={{ color: "#000" }}><b>MMSI:</b> {selected.mmsi}</p>
      <p style={{ color: "#000" }}><b>Vessel Type:</b> {selected.vesselType}</p>
      <p style={{ color: "#000" }}><b>Priority:</b> {selected.priority}</p>
      <p style={{ color: "#000" }}><b>Status:</b> {selected.status}</p>
      <p style={{ color: "#000" }}><b>SOG:</b> {Number.isFinite(selected.sog) ? selected.sog.toFixed(2) : "Invalid"}</p>
      <p style={{ color: "#000" }}><b>Latitude:</b> {Number.isFinite(selected.lat) ? selected.lat.toFixed(6) : "Invalid"}</p>
      <p style={{ color: "#000" }}><b>Longitude:</b> {Number.isFinite(selected.lon) ? selected.lon.toFixed(6) : "Invalid"}</p>
      <p style={{ color: "#000" }}><b>Timestamp:</b> {formatDate(selected.timestamp)}</p>
      <p style={{ color: "#000" }}><b>Owner:</b> {selected.owner}</p>
      <p style={{ color: "#000" }}><b>Description:</b> {selected.description}</p>
      <button onClick={() => setSelected(null)}>Close</button>
    </div>}

    <div className="card">
      <h3>AIS Operational Response</h3>
      <div style={{ width: "100%", overflowX: "auto" }}><table className="uccis-table" style={{ minWidth: 1000, width: "100%" }}><thead><tr><th>Incident ID</th><th>MMSI</th><th>Vessel Type</th><th>Priority</th><th>Status</th><th>SOG</th><th>Timestamp</th></tr></thead><tbody>
        {loading ? <tr><td colSpan="7" style={{ color: "#000", textAlign: "center", padding: 18 }}>Loading AIS response...</td></tr> : incidents.length === 0 ? <tr><td colSpan="7" style={{ color: "#000", textAlign: "center", padding: 18 }}>No AIS operational records found.</td></tr> : incidents.slice(0, 15).map(item => <tr key={`${item.id}-table`}>
          <td style={{ color: "#000" }}>{item.incidentId}</td><td style={{ color: "#000" }}>{item.mmsi}</td><td style={{ color: "#000" }}>{item.vesselType}</td><td style={{ color: "#000" }}>{item.priority}</td><td style={{ color: "#000" }}>{item.status}</td><td style={{ color: "#000" }}>{Number.isFinite(item.sog) ? item.sog.toFixed(2) : "Invalid"}</td><td style={{ color: "#000" }}>{formatDate(item.timestamp)}</td>
        </tr>)}
      </tbody></table></div>
    </div>
  </div>;
}
