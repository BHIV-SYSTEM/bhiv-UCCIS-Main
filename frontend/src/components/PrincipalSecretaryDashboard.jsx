// src/pages/PrincipalSecretaryDashboard.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

import EscalationChainPanel from "../components/governance/EscalationChainPanel";
import UnresolvedWorkflowPanel from "../components/governance/UnresolvedWorkflowPanel";
import AgingIncidentPanel from "../components/governance/AgingIncidentPanel";
import DependencyFailurePanel from "../components/governance/DependencyFailurePanel";
import DelayedExecutionPanel from "../components/governance/DelayedExecutionPanel";
import DistrictOperationalHealth from "../components/governance/DistrictOperationalHealth";
import ReplaySummaryInspection from "../components/governance/ReplaySummaryInspection";
import OperationalLineageSummary from "../components/governance/OperationalLineageSummary";

const AIS_FILE = "/AIS_file.csv";

const COLORS = {
  cyan: "#22d3ee",
  blue: "#60a5fa",
  green: "#4ade80",
  amber: "#fbbf24",
  orange: "#fb923c",
  red: "#f87171",
  purple: "#c084fc",
  grid: "#263244",
  axis: "#aab6c8",
};

const TOOLTIP_STYLE = {
  backgroundColor: "#0b1220",
  border: "1px solid #334155",
  borderRadius: "10px",
  color: "#f8fafc",
  boxShadow: "0 12px 28px rgba(0,0,0,.35)",
};

const styles = `
  .ps-dashboard, .ps-dashboard * { box-sizing: border-box; }
  .ps-dashboard {
    min-height: 100vh; width: 100%; padding: 26px;
    color: #f8fafc; background: #070b12;
    font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }
  .ps-main { width: 100%; max-width: 1700px; margin: 0 auto; }
  .ps-header { display:flex; align-items:flex-start; justify-content:space-between; gap:20px; padding-bottom:22px; margin-bottom:22px; border-bottom:1px solid #263244; }
  .ps-kicker { margin:0 0 9px; color:#22d3ee; font-size:11px; font-weight:800; letter-spacing:.16em; text-transform:uppercase; }
  .ps-title { margin:0; color:#f8fafc; font-size:clamp(27px,3.2vw,42px); line-height:1.15; font-weight:850; letter-spacing:-.04em; }
  .ps-subtitle { margin:11px 0 0; color:#aab6c8; font-size:14px; line-height:1.65; max-width:850px; }
  .ps-meta { margin-top:10px; color:#8290a5; font-size:12px; }
  .ps-meta strong { color:#cbd5e1; }
  .ps-actions { display:flex; flex-wrap:wrap; gap:10px; }
  .ps-button { border:1px solid #334155; border-radius:10px; padding:10px 14px; background:#121a28; color:#f8fafc; font-weight:700; font-size:13px; cursor:pointer; white-space:nowrap; }
  .ps-button:hover { background:#1b2738; border-color:#475569; }
  .ps-button:disabled { opacity:.6; cursor:wait; }
  .ps-alert { padding:14px 16px; border:1px solid #7f1d1d; border-radius:12px; background:#241217; color:#fecaca; margin-bottom:20px; line-height:1.6; font-size:13px; }
  .ps-alert strong { color:#fff1f2; }
  .ps-info { padding:14px 16px; border:1px solid #155e75; border-radius:12px; background:#0c202b; color:#bae6fd; margin-bottom:20px; line-height:1.6; font-size:13px; }
  .ps-kpis { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:15px; margin-bottom:20px; }
  .ps-kpi { min-width:0; position:relative; overflow:hidden; border:1px solid #263244; border-radius:15px; padding:19px; background:linear-gradient(145deg,#121a28,#0d131e); }
  .ps-kpi:before { content:""; position:absolute; left:0; top:0; bottom:0; width:3px; background:var(--accent,#22d3ee); }
  .ps-kpi-label { color:#9aa8bc; font-size:10px; font-weight:800; letter-spacing:.1em; text-transform:uppercase; }
  .ps-kpi-value { margin-top:11px; color:var(--accent,#f8fafc); font-size:clamp(25px,2.6vw,34px); font-weight:850; letter-spacing:-.04em; overflow-wrap:anywhere; }
  .ps-kpi-note { margin-top:7px; color:#718096; font-size:11px; line-height:1.4; }
  .ps-panel { min-width:0; border:1px solid #263244; border-radius:16px; padding:20px; background:#101722; box-shadow:0 10px 30px rgba(0,0,0,.16); }
  .ps-panel-head { display:flex; align-items:flex-start; justify-content:space-between; gap:14px; margin-bottom:16px; }
  .ps-panel-title { margin:0; color:#f1f5f9; font-size:17px; line-height:1.4; font-weight:750; }
  .ps-panel-desc { margin:5px 0 0; color:#8290a5; font-size:12px; line-height:1.5; }
  .ps-grid-2 { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:18px; margin-bottom:18px; }
  .ps-grid-3 { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:18px; margin-bottom:18px; }
  .ps-grid-1 { display:grid; grid-template-columns:minmax(0,1fr); gap:18px; margin-bottom:18px; }
  .ps-chart { width:100%; height:300px; min-width:0; }
  .ps-chart-tall { height:340px; }
  .ps-pill { display:inline-flex; align-items:center; border:1px solid #334155; border-radius:999px; padding:5px 9px; color:#cbd5e1; background:#182131; font-size:10px; font-weight:800; letter-spacing:.06em; white-space:nowrap; }
  .ps-pill-good { color:#86efac; background:#0b281b; border-color:#166534; }
  .ps-pill-warn { color:#fcd34d; background:#2a210d; border-color:#854d0e; }
  .ps-pill-danger { color:#fca5a5; background:#2c1217; border-color:#7f1d1d; }
  .ps-summary-row { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:12px; }
  .ps-summary { padding:14px; background:#0b111b; border:1px solid #253143; border-radius:12px; min-width:0; }
  .ps-summary-label { color:#8d9bb0; font-size:10px; text-transform:uppercase; letter-spacing:.08em; font-weight:800; }
  .ps-summary-value { margin-top:7px; color:#f8fafc; font-size:19px; font-weight:800; overflow-wrap:anywhere; }
  .ps-table-wrap { width:100%; overflow-x:auto; }
  .ps-table { width:100%; border-collapse:collapse; min-width:690px; font-size:12px; }
  .ps-table th { padding:12px 10px; text-align:left; background:#0b111b; color:#8fa0b6; text-transform:uppercase; font-size:10px; letter-spacing:.07em; border-bottom:1px solid #334155; }
  .ps-table td { padding:13px 10px; color:#d5deea; border-bottom:1px solid #202b3b; white-space:nowrap; }
  .ps-table tbody tr:hover { background:#151f2e; }
  .ps-table tr:last-child td { border-bottom:0; }
  .ps-right { text-align:right !important; }
  .ps-zone-name { color:#f8fafc !important; font-weight:700; }
  .ps-meter { height:6px; width:82px; background:#263244; border-radius:999px; overflow:hidden; display:inline-block; vertical-align:middle; margin-right:8px; }
  .ps-meter span { display:block; height:100%; border-radius:inherit; background:linear-gradient(90deg,#22d3ee,#3b82f6); }
  .ps-note-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:12px; }
  .ps-note { padding:15px; border:1px solid #29364a; background:#0b111b; border-radius:12px; }
  .ps-note h3 { margin:0 0 7px; color:#e2e8f0; font-size:13px; }
  .ps-note p { margin:0; color:#aab6c8; font-size:12px; line-height:1.7; }
  .ps-footer { text-align:right; color:#68778d; font-size:11px; padding:2px 0 10px; }
  .ps-dashboard .recharts-text { fill:#aab6c8; }
  .ps-dashboard .recharts-legend-item-text { color:#cbd5e1 !important; }
  .ps-dashboard .recharts-tooltip-item { color:#f8fafc !important; }
  .ps-empty { min-height:170px; display:flex; align-items:center; justify-content:center; text-align:center; color:#8290a5; font-size:13px; padding:20px; }
  @media (max-width:1150px) { .ps-kpis { grid-template-columns:repeat(2,minmax(0,1fr)); } .ps-grid-3 { grid-template-columns:repeat(2,minmax(0,1fr)); } }
  @media (max-width:760px) {
    .ps-dashboard { padding:15px; }
    .ps-header { flex-direction:column; }
    .ps-actions { width:100%; }
    .ps-button { flex:1; }
    .ps-grid-2,.ps-grid-3 { grid-template-columns:minmax(0,1fr); }
    .ps-panel { padding:15px; }
    .ps-chart { height:280px; }
    .ps-chart-tall { height:310px; }
    .ps-summary-row,.ps-note-grid { grid-template-columns:minmax(0,1fr); }
  }
  @media (max-width:430px) { .ps-kpis { grid-template-columns:minmax(0,1fr); } .ps-kpi { padding:16px; } .ps-title { font-size:27px; } }
`;

function parseCSV(text) {
  const input = String(text || "").replace(/^\uFEFF/, "");
  const rows = [];
  let row = [];
  let value = "";
  let quoted = false;

  for (let i = 0; i < input.length; i += 1) {
    const char = input[i];
    const next = input[i + 1];

    if (char === '"') {
      if (quoted && next === '"') {
        value += '"';
        i += 1;
      } else {
        quoted = !quoted;
      }
    } else if (char === "," && !quoted) {
      row.push(value.trim());
      value = "";
    } else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && next === "\n") i += 1;
      row.push(value.trim());
      if (row.some((item) => item !== "")) rows.push(row);
      row = [];
      value = "";
    } else {
      value += char;
    }
  }

  row.push(value.trim());
  if (row.some((item) => item !== "")) rows.push(row);
  if (rows.length < 2) return [];

  const headers = rows[0].map((item) => item.trim());
  return rows.slice(1).map((values) => {
    const record = {};
    headers.forEach((header, index) => {
      record[header] = (values[index] ?? "").trim();
    });
    return record;
  });
}

function toNumber(value) {
  const number = Number.parseFloat(String(value ?? "").replace(/,/g, ""));
  return Number.isFinite(number) ? number : NaN;
}

function normalizeAISRow(row) {
  const mmsi = String(row.MMSI ?? row.mmsi ?? "").trim();
  const timestamp = String(row.BaseDateTime ?? row.Timestamp ?? row.timestamp ?? "").trim();
  const lat = toNumber(row.LAT ?? row.lat ?? row.Latitude);
  const lon = toNumber(row.LON ?? row.lon ?? row.Longitude);
  const sog = toNumber(row.SOG ?? row.sog);
  const vesselType = String(row.VesselType ?? row.vesselType ?? row.VESSEL_TYPE ?? "Unknown").trim();

  const validMMSI = /^\d+$/.test(mmsi);
  const validCoordinates =
    Number.isFinite(lat) &&
    Number.isFinite(lon) &&
    lat >= -90 &&
    lat <= 90 &&
    lon >= -180 &&
    lon <= 180;
  const validSOG = Number.isFinite(sog) && sog >= 0;

  return {
    mmsi,
    timestamp,
    lat,
    lon,
    sog,
    vesselType: vesselType || "Unknown",
    valid: validMMSI && validCoordinates && validSOG,
  };
}

function getAISZone(lat, lon) {
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return "Unknown";
  if (lat >= 15 && lat <= 25 && lon >= -165 && lon <= -150) return "Hawaii / Pacific Islands";
  if (lat >= 24 && lat <= 31 && lon >= -98 && lon <= -80) return "Gulf Coast";
  if (lat >= 24 && lat <= 31 && lon >= -82 && lon <= -78) return "Florida / Atlantic";
  if (lat >= 31 && lat <= 46 && lon >= -82 && lon <= -65) return "Atlantic / Northeast";
  if (lat >= 25 && lat <= 49 && lon >= -130 && lon <= -115) return "Pacific / West Coast";
  return "Other";
}

function calculateRiskScore(activity, averageSOG) {
  const activityScore = activity * 0.75;
  const movementScore = Math.min(averageSOG * 7, 25);
  return Math.max(0, Math.min(100, Math.round(activityScore + movementScore)));
}

function formatNumber(value) {
  return Number.isFinite(value) ? value.toLocaleString() : "—";
}

function riskLabel(score) {
  if (score >= 75) return "HIGH";
  if (score >= 45) return "MEDIUM";
  return "LOW";
}

function Panel({ title, description, children, badge }) {
  return (
    <section className="ps-panel">
      <div className="ps-panel-head">
        <div>
          <h2 className="ps-panel-title">{title}</h2>
          {description && <p className="ps-panel-desc">{description}</p>}
        </div>
        {badge && <span className="ps-pill">{badge}</span>}
      </div>
      {children}
    </section>
  );
}

export default function PrincipalSecretaryDashboard() {
  const [aisRows, setAisRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aisError, setAisError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function loadAIS() {
      setLoading(true);
      setAisError("");
      try {
        const response = await fetch(AIS_FILE, {
          signal: controller.signal,
          cache: "no-store",
        });
        if (!response.ok) {
          throw new Error(`AIS_file.csv could not be loaded (HTTP ${response.status}).`);
        }

        const csvText = await response.text();
        const parsed = parseCSV(csvText);
        if (!parsed.length) {
          throw new Error("AIS_file.csv is empty or does not contain a valid CSV header and data rows.");
        }

        const normalized = parsed.map(normalizeAISRow);
        const validRows = normalized.filter((row) => row.valid);
        if (validRows.length === 0) {
          throw new Error("The CSV loaded, but no valid rows were found. Check MMSI, LAT, LON and SOG column names and values.");
        }
        setAisRows(validRows);
      } catch (error) {
        if (error.name === "AbortError") return;
        console.error("Principal Secretary AIS loading error:", error);
        setAisError(error.message || "Unable to load AIS_file.csv.");
        setAisRows([]);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    loadAIS();
    return () => controller.abort();
  }, [refreshKey]);

  const metrics = useMemo(() => {
    const vessels = new Set(aisRows.map((row) => row.mmsi));
    const types = new Set(aisRows.map((row) => row.vesselType).filter(Boolean));
    const averageSOG = aisRows.length
      ? aisRows.reduce((sum, row) => sum + row.sog, 0) / aisRows.length
      : 0;
    const movingCount = aisRows.filter((row) => row.sog > 0.5).length;
    const activity = aisRows.length ? (movingCount / aisRows.length) * 100 : 0;
    return {
      totalRecords: aisRows.length,
      uniqueVessels: vessels.size,
      vesselTypes: types.size,
      averageSOG: Number(averageSOG.toFixed(2)),
      activity: Number(activity.toFixed(1)),
    };
  }, [aisRows]);

  const zoneData = useMemo(() => {
    const zones = new Map();

    aisRows.forEach((row) => {
      const name = getAISZone(row.lat, row.lon);
      if (name === "Other" || name === "Unknown") return;

      if (!zones.has(name)) {
        zones.set(name, {
          name,
          records: 0,
          vessels: new Set(),
          totalSOG: 0,
          moving: 0,
          latestTimestamp: "",
        });
      }

      const zone = zones.get(name);
      zone.records += 1;
      zone.vessels.add(row.mmsi);
      zone.totalSOG += row.sog;
      if (row.sog > 0.5) zone.moving += 1;
      if (row.timestamp > zone.latestTimestamp) zone.latestTimestamp = row.timestamp;
    });

    return Array.from(zones.values()).map((zone) => {
      const averageSOG = zone.records ? zone.totalSOG / zone.records : 0;
      const activity = zone.records ? (zone.moving / zone.records) * 100 : 0;
      return {
        name: zone.name,
        records: zone.records,
        vessels: zone.vessels.size,
        averageSOG: Number(averageSOG.toFixed(2)),
        activity: Number(activity.toFixed(1)),
        riskScore: calculateRiskScore(activity, averageSOG),
      };
    }).sort((a, b) => b.records - a.records);
  }, [aisRows]);

  const escalationChartData = useMemo(() => {
    const sorted = [...zoneData].sort((a, b) => b.riskScore - a.riskScore);
    return sorted.slice(0, 5).map((zone, index) => ({
      name: zone.name.replace(" / ", "\n"),
      active: Math.max(0, Math.round(zone.riskScore / 10)),
      resolved: Math.max(0, Math.round(zone.activity / 10)),
      riskScore: zone.riskScore,
      originalName: zone.name,
      level: `Level ${index + 1}`,
    }));
  }, [zoneData]);

  const agingIncidentData = useMemo(() => {
    if (!zoneData.length) return [];
    const highestRisk = Math.max(...zoneData.map((zone) => zone.riskScore));
    return [
      { name: "0–2 hrs", incidents: highestRisk > 80 ? 18 : 12 },
      { name: "2–4 hrs", incidents: highestRisk > 75 ? 12 : 9 },
      { name: "4–8 hrs", incidents: highestRisk > 70 ? 9 : 7 },
      { name: "8–12 hrs", incidents: highestRisk > 60 ? 6 : 4 },
      { name: "12+ hrs", incidents: highestRisk > 50 ? 4 : 2 },
    ];
  }, [zoneData]);

  const delayedExecutionData = useMemo(
    () => [...zoneData]
      .sort((a, b) => b.riskScore - a.riskScore)
      .slice(0, 5)
      .map((zone) => ({
        name: zone.name.replace(" / ", " "),
        delayed: Math.round(zone.riskScore / 10),
        activity: zone.activity,
      })),
    [zoneData]
  );

  const districtHealthData = useMemo(
    () => [...zoneData]
      .sort((a, b) => a.riskScore - b.riskScore)
      .slice(0, 6)
      .map((zone) => ({
        name: zone.name.replace(" / ", " "),
        health: Math.max(0, Math.min(100, Math.round(100 - zone.riskScore * 0.28))),
        riskScore: zone.riskScore,
      })),
    [zoneData]
  );

  const riskDistribution = useMemo(() => {
    const values = { Low: 0, Medium: 0, High: 0 };
    zoneData.forEach((zone) => {
      values[riskLabel(zone.riskScore) === "HIGH" ? "High" : riskLabel(zone.riskScore) === "MEDIUM" ? "Medium" : "Low"] += 1;
    });
    return [
      { name: "Low", value: values.Low, color: COLORS.green },
      { name: "Medium", value: values.Medium, color: COLORS.amber },
      { name: "High", value: values.High, color: COLORS.red },
    ];
  }, [zoneData]);

  const governanceOverview = useMemo(() => [
    { name: "AIS Records", value: metrics.totalRecords },
    { name: "Vessels", value: metrics.uniqueVessels },
    { name: "Types", value: metrics.vesselTypes },
    { name: "Zones", value: zoneData.length },
  ], [metrics, zoneData]);

  const highestRiskZone = useMemo(
    () => [...zoneData].sort((a, b) => b.riskScore - a.riskScore)[0] || null,
    [zoneData]
  );
  const highestActivityZone = useMemo(
    () => [...zoneData].sort((a, b) => b.activity - a.activity)[0] || null,
    [zoneData]
  );

  const chartEmpty = !loading && !aisError && zoneData.length === 0;

  return (
    <div className="ps-dashboard">
      <style>{styles}</style>
      <main className="ps-main">
        <header className="ps-header">
          <div>
            <p className="ps-kicker">UCCIS · Unified Governance Intelligence</p>
            <h1 className="ps-title">Principal Secretary Operations Center</h1>
            <p className="ps-subtitle">
              AIS-driven administrative oversight, escalation monitoring, incident aging,
              execution visibility and operational health.
            </p>
            {/* <p className="ps-meta">
              Data source: <strong>AIS_file.csv</strong> · File path: <strong>{AIS_FILE}</strong>
            </p> */}
          </div>
          <div className="ps-actions">
            {/* <button
              type="button"
              className="ps-button"
              onClick={() => setRefreshKey((value) => value + 1)}
              disabled={loading}
            >
              {loading ? "Loading…" : "↻ Refresh AIS"}
            </button> */}
          </div>
        </header>

        {aisError && (
          <div className="ps-alert" role="alert">
            <strong>AIS data could not be loaded.</strong> {aisError}
            <div style={{ marginTop: 6 }}>
              Confirm that the file exists at <strong>public/AIS_file.csv</strong> and that it includes
              the columns <strong>MMSI, LAT, LON, SOG</strong> and preferably <strong>VesselType</strong>.
            </div>
          </div>
        )}

        {!aisError && !loading && (
          <div className="ps-info">
            Metrics below are calculated from the valid AIS rows that were loaded. Incident aging,
            execution delay and district health visualizations are illustrative indicators derived
            from AIS risk/activity—not fields directly supplied by the CSV.
          </div>
        )}

        <section className="ps-kpis" aria-label="AIS key performance indicators">
          <div className="ps-kpi" style={{ "--accent": COLORS.cyan }}>
            <div className="ps-kpi-label">AIS Records</div>
            <div className="ps-kpi-value">{loading ? "…" : formatNumber(metrics.totalRecords)}</div>
            <div className="ps-kpi-note">Valid vessel position rows</div>
          </div>
          <div className="ps-kpi" style={{ "--accent": COLORS.blue }}>
            <div className="ps-kpi-label">Unique Vessels</div>
            <div className="ps-kpi-value">{loading ? "…" : formatNumber(metrics.uniqueVessels)}</div>
            <div className="ps-kpi-note">Distinct MMSI identifiers</div>
          </div>
          <div className="ps-kpi" style={{ "--accent": COLORS.amber }}>
            <div className="ps-kpi-label">Average SOG</div>
            <div className="ps-kpi-value">{loading ? "…" : `${metrics.averageSOG} kn`}</div>
            <div className="ps-kpi-note">Speed over ground</div>
          </div>
          <div className="ps-kpi" style={{ "--accent": COLORS.green }}>
            <div className="ps-kpi-label">Vessel Types</div>
            <div className="ps-kpi-value">{loading ? "…" : formatNumber(metrics.vesselTypes)}</div>
            <div className="ps-kpi-note">Distinct classifications</div>
          </div>
        </section>

        <section className="ps-grid-1">
          <Panel
            title="AIS Operational Snapshot"
            description="Highest-risk and highest-activity geographic areas found in the loaded dataset."
            badge={loading ? "LOADING" : aisError ? "NO DATA" : `${zoneData.length} ZONES`}
          >
            {loading ? (
              <div className="ps-empty">Loading AIS operational intelligence…</div>
            ) : aisError ? (
              <div className="ps-empty">Load AIS_file.csv to see operational indicators.</div>
            ) : zoneData.length === 0 ? (
              <div className="ps-empty">
                No rows matched the configured geographic zones. Check the coordinates in AIS_file.csv.
              </div>
            ) : (
              <div className="ps-summary-row">
                <div className="ps-summary">
                  <div className="ps-summary-label">Highest risk zone</div>
                  <div className="ps-summary-value">{highestRiskZone?.name || "—"}</div>
                  <p className="ps-panel-desc">Calculated score: {highestRiskZone?.riskScore ?? "—"} / 100</p>
                </div>
                <div className="ps-summary">
                  <div className="ps-summary-label">Highest activity zone</div>
                  <div className="ps-summary-value">{highestActivityZone?.name || "—"}</div>
                  <p className="ps-panel-desc">Moving records: {highestActivityZone?.activity ?? "—"}%</p>
                </div>
                <div className="ps-summary">
                  <div className="ps-summary-label">Overall vessel movement</div>
                  <div className="ps-summary-value">{metrics.activity}%</div>
                  <p className="ps-panel-desc">Records with SOG above 0.5 knots</p>
                </div>
              </div>
            )}
          </Panel>
        </section>

        <section className="ps-grid-2">
          <Panel title="Escalation Chain Status" description="Risk and movement indicators by AIS geographic zone.">
            {loading ? <div className="ps-empty">Loading chart…</div> : chartEmpty ? <div className="ps-empty">No zone data available to chart.</div> : (
              <div className="ps-chart ps-chart-tall">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={escalationChartData} margin={{ top: 10, right: 10, left: -12, bottom: 40 }} barGap={8}>
                    <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
                    <XAxis
        dataKey="originalName"
        interval={0}
        angle={-18}
        textAnchor="end"
        height={75}
        tick={{
          fill: "#cbd5e1",
          fontSize: 10,
        }}
        axisLine={{ stroke: "#475569" }}
        tickLine={{ stroke: "#475569" }}
        label={{
          value: "Escalation Category",
          position: "insideBottom",
          offset: -25,
          fill: "#ffffff",
          fontSize: 12,
        }}
      />

      <YAxis
        allowDecimals={false}
        width={45}
        tick={{
          fill: "#cbd5e1",
          fontSize: 11,
        }}
        axisLine={{ stroke: "#475569" }}
        tickLine={{ stroke: "#475569" }}
        label={{
          value: "Number of Escalations",
          angle: -90,
          position: "outsideLeft",
          offset: -5,
          fill: "#ffffff",
          fontSize: 12,
          style: {
            textAnchor: "middle",
          },
        }}
        />
                    <Tooltip contentStyle={TOOLTIP_STYLE} labelStyle={{ color: "#f8fafc" }} />
                    <Legend wrapperStyle={{ color: "#cbd5e1", fontSize: 12 }} />
                    <Bar dataKey="active" name="Risk indicator" fill={COLORS.red} radius={[5, 5, 0, 0]} maxBarSize={38} />
                    <Bar dataKey="resolved" name="Movement indicator" fill={COLORS.green} radius={[5, 5, 0, 0]} maxBarSize={38} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </Panel>

          <Panel title="Aging Incident Distribution" description="Illustrative aging buckets derived from the current zone risk indicator.">
            {loading ? <div className="ps-empty">Loading chart…</div> : chartEmpty ? <div className="ps-empty">No zone data available to estimate buckets.</div> : (
              <div className="ps-chart ps-chart-tall">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={agingIncidentData} margin={{ top: 10, right: 12, left: -15, bottom: 12 }}>
                    <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
<XAxis
  dataKey="name"
  tick={{
    fill: "#cbd5e1",
    fontSize: 11,
  }}
  axisLine={{ stroke: "#475569" }}
  tickLine={{ stroke: "#475569" }}
  label={{
    value: "Hours",
    position: "insideBottom",
    offset: -5,
    fill: "#ffffff",
    fontSize: 12,
  }}
/>

<YAxis
  allowDecimals={false}
  width={75}
  tick={{
    fill: "#cbd5e1",
    fontSize: 11,
  }}
  axisLine={{ stroke: "#475569" }}
  tickLine={{ stroke: "#475569" }}
  label={{
    value: "Count",
    angle: -90,
    position: "outside",
    offset: 0,
    fill: "#ffffff",
    fontSize: 12,
    style: {
      textAnchor: "middle",
    },
  }}
/>
                    <Tooltip contentStyle={TOOLTIP_STYLE} />
                    <Bar dataKey="incidents" name="Illustrative count" fill={COLORS.amber} radius={[6, 6, 0, 0]} maxBarSize={46} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </Panel>
        </section>

        <section className="ps-grid-2">
          <Panel title="Delayed Execution Visibility" description="Illustrative delay index ranked by AIS-derived risk.">
            {loading ? <div className="ps-empty">Loading chart…</div> : chartEmpty ? <div className="ps-empty">No zone data available.</div> : (
              <div className="ps-chart">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={delayedExecutionData} margin={{ top: 10, right: 18, left: -15, bottom: 45 }}>
                    <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
<XAxis
  dataKey="name"
  interval={0}
  angle={-20}
  textAnchor="end"
  height={75}
  tick={{
    fill: "#cbd5e1",
    fontSize: 7,
  }}
  axisLine={{ stroke: "#475569" }}
  tickLine={{ stroke: "#475569" }}
  label={{
    value: "Execution Category",
    position: "insideBottom",
    offset: -8,
    fill: "#ffffff",
    fontSize: 12,
  }}
/>

<YAxis
  allowDecimals={false}
  width={65}
  tick={{
    fill: "#cbd5e1",
    fontSize: 11,
  }}
  axisLine={{ stroke: "#475569" }}
  tickLine={{ stroke: "#475569" }}
  label={{
    value: "Delayed Executions",
    angle: -90,
    position: "outsideLeft",
    offset: 5,
    fill: "#ffffff",
    fontSize: 12,
    style: {
      textAnchor: "middle",
    },
  }}
/>
                    <Tooltip contentStyle={TOOLTIP_STYLE} />
                    <Line type="monotone" dataKey="delayed" name="Derived delay index" stroke={COLORS.orange} strokeWidth={3} dot={{ r: 4, fill: COLORS.orange, strokeWidth: 0 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </Panel>

          <Panel title="District Operational Health" description="Illustrative inverse of AIS risk; not an official district health score.">
            {loading ? <div className="ps-empty">Loading chart…</div> : chartEmpty ? <div className="ps-empty">No zone data available.</div> : (
              <div className="ps-chart ps-chart-tall">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={districtHealthData} layout="vertical" margin={{ top: 5, right: 18, left: 12, bottom: 5 }}>
                    <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
<XAxis
  type="number"
  domain={[0, 100]}
  tick={{
    fill: "#cbd5e1",
    fontSize: 11,
  }}
  axisLine={{ stroke: "#475569" }}
  tickLine={{ stroke: "#475569" }}
  label={{
    value: "Operational Health (%)",
    position: "insideBottom",
    offset: -5,
    fill: "#ffffff",
    fontSize: 12,
  }}
/>

<YAxis
  type="category"
  dataKey="name"
  width={150}
  tick={{
    fill: "#cbd5e1",
    fontSize: 10,
  }}
  axisLine={{ stroke: "#475569" }}
  tickLine={{ stroke: "#475569" }}
  label={{
    value: "District",
    angle: -90,
    position: "insideLeft",
    offset: 10,
    fill: "#ffffff",
    fontSize: 12,
    style: {
      textAnchor: "middle",
    },
  }}
/>
                    <Tooltip contentStyle={TOOLTIP_STYLE} />
                    <Bar dataKey="health" name="Illustrative health index" fill={COLORS.green} radius={[0, 5, 5, 0]} maxBarSize={24} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </Panel>
        </section>

        <section className="ps-grid-2">
          <Panel title="AIS Zone Operational Intelligence" description="Geographic vessel activity calculated from AIS_file.csv.">
            {loading ? <div className="ps-empty">Loading zone data…</div> : aisError ? <div className="ps-empty">AIS data unavailable.</div> : zoneData.length === 0 ? <div className="ps-empty">No records matched the configured zones.</div> : (
              <div className="ps-table-wrap">
                <table className="ps-table">
                  <thead>
                    <tr>
                      <th>Zone</th>
                      <th className="ps-right">Records</th>
                      <th className="ps-right">Vessels</th>
                      <th className="ps-right">Avg SOG</th>
                      <th>Activity</th>
                      <th className="ps-right">Risk</th>
                    </tr>
                  </thead>
                  <tbody>
                    {zoneData.map((zone) => (
                      <tr key={zone.name}>
<td className="ps-zone-name" style={{ color: "#000000", WebkitTextFillColor: "#000000" }}>
  {zone.name}
</td>

<td className="ps-right" style={{ color: "#000000" }}>
  {formatNumber(zone.records)}
</td>

<td className="ps-right" style={{ color: "#000000" }}>
  {formatNumber(zone.vessels)}
</td>

<td className="ps-right" style={{ color: "#000000" }}>
  {zone.averageSOG} kn
</td>
                        <td>
                          <span className="ps-meter"><span style={{ width: `${zone.activity}%` }} /></span>
                          {zone.activity}%
                        </td>
                        <td className="ps-right">
                          <span className={zone.riskScore >= 75 ? "ps-pill ps-pill-danger" : zone.riskScore >= 45 ? "ps-pill ps-pill-warn" : "ps-pill ps-pill-good"}>
                            {zone.riskScore} · {riskLabel(zone.riskScore)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Panel>

          <Panel title="AIS Activity Overview" description="The scale differs by metric; use this as a dataset overview rather than a like-for-like comparison.">
            {loading ? <div className="ps-empty">Loading chart…</div> : (
              <div className="ps-chart">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={governanceOverview} margin={{ top: 10, right: 10, left: -10, bottom: 28 }}>
                    <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
<XAxis
  dataKey="name"
  interval={0}
  angle={-15}
  textAnchor="end"
  height={70}
  tick={{
    fill: "#cbd5e1",
    fontSize: 10,
  }}
  axisLine={{ stroke: "#475569" }}
  tickLine={{ stroke: "#475569" }}
  label={{
    value: "AIS Activity Type",
    position: "insideBottom",
    offset: -5,
    fill: "#ffffff",
    fontSize: 12,
  }}
/>

<YAxis
  allowDecimals={false}
  width={65}
  tick={{
    fill: "#cbd5e1",
    fontSize: 11,
  }}
  axisLine={{ stroke: "#475569" }}
  tickLine={{ stroke: "#475569" }}
  label={{
    value: "Activity Count",
    angle: -90,
    position: "outsideLeft",
    offset: 5,
    fill: "#ffffff",
    fontSize: 12,
    style: {
      textAnchor: "middle",
    },
  }}
/>
                    <Tooltip contentStyle={TOOLTIP_STYLE} />
                    <Bar dataKey="value" name="Metric value" fill={COLORS.blue} radius={[5, 5, 0, 0]} maxBarSize={44} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </Panel>
        </section>

        <section className="ps-grid-2">
          <Panel title="AIS Risk Distribution" description="Zones grouped by calculated AIS activity risk.">
            {loading ? <div className="ps-empty">Loading chart…</div> : chartEmpty ? <div className="ps-empty">No zone data available.</div> : (
              <div className="ps-chart">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={riskDistribution} dataKey="value" nameKey="name" cx="50%" cy="48%" outerRadius={95} innerRadius={53} paddingAngle={3} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                      {riskDistribution.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                    </Pie>
                    <Tooltip contentStyle={TOOLTIP_STYLE} />
                    <Legend wrapperStyle={{ color: "#cbd5e1", fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </Panel>

          <Panel title="Operational Interpretation" description="Concise summary based on the loaded AIS records.">
            {loading ? <div className="ps-empty">Calculating operational indicators…</div> : (
              <div className="ps-note-grid">
                <div className="ps-note">
                  <h3>Vessel movement</h3>
                  <p>{metrics.activity}% of valid AIS records have SOG above 0.5 knots. This reflects recorded movement, not a forecast.</p>
                </div>
                <div className="ps-note">
                  <h3>Risk indicator</h3>
                  <p>{highestRiskZone ? `${highestRiskZone.name} has the highest calculated zone score (${highestRiskZone.riskScore}/100).` : "No geographic zone scores are available."}</p>
                </div>
                <div className="ps-note">
                  <h3>Dataset coverage</h3>
                  <p>{formatNumber(metrics.totalRecords)} valid records across {formatNumber(metrics.uniqueVessels)} unique vessel identifiers.</p>
                </div>
                <div className="ps-note">
                  <h3>Data quality</h3>
                  <p>Rows with invalid MMSI, coordinates or SOG are excluded from these metrics.</p>
                </div>
              </div>
            )}
          </Panel>
        </section>

        <section className="ps-grid-2">
          <Panel title="Escalation Chains" description="Existing governance workflow component.">
            <EscalationChainPanel chains={[]} />
          </Panel>
          <Panel title="Unresolved Workflows" description="Existing governance workflow component.">
            <UnresolvedWorkflowPanel />
          </Panel>
        </section>

        <section className="ps-grid-2">
          <Panel title="Aging Incidents" description="Existing governance workflow component.">
            <AgingIncidentPanel incidents={[]} />
          </Panel>
          <Panel title="Dependency Failures" description="Existing governance workflow component.">
            <DependencyFailurePanel />
          </Panel>
        </section>

        <section className="ps-grid-2">
          <Panel title="Delayed Execution" description="Existing governance workflow component.">
            <DelayedExecutionPanel delays={[]} />
          </Panel>
          <Panel title="District Operational Health" description="Existing governance workflow component.">
            <DistrictOperationalHealth districts={[]} />
          </Panel>
        </section>

        <section className="ps-grid-2">
          <Panel title="Replay Summary Inspection" description="Existing governance component.">
            <ReplaySummaryInspection />
          </Panel>
          <Panel title="Operational Lineage Summary" description="Existing governance component.">
            <OperationalLineageSummary />
          </Panel>
        </section>

        {/* <footer className="ps-footer">
          AIS source: AIS_file.csv · AIS-derived scores are indicators, not verified incident predictions.
        </footer> */}
      </main>
    </div>
  );
}
