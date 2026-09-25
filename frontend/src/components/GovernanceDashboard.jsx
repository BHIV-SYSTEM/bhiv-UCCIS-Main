import React, { useEffect, useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

/*
  UCCIS Governance Dashboard
  --------------------------------
  - Dashboard
  - Escalation Management
  - Field Execution
  - Replay View
  - AIS-backed zone metrics
  - No hard-coded random values
*/

const COLORS = ["#ef4444", "#f97316", "#f59e0b", "#22c55e"];
const AIS_ZONE_NAMES = [
  "PACIFIC / WEST COAST",
  "GULF COAST",
  "ATLANTIC / NORTHEAST",
  "FLORIDA / ATLANTIC",
  "CENTRAL / INLAND",
  "HAWAII / PACIFIC ISLANDS",
];

const zoneCenter = {
  "PACIFIC / WEST COAST": [34.2, -119.2],
  "GULF COAST": [29.5, -91.0],
  "ATLANTIC / NORTHEAST": [40.2, -72.5],
  "FLORIDA / ATLANTIC": [27.5, -81.5],
  "CENTRAL / INLAND": [35.0, -97.0],
  "HAWAII / PACIFIC ISLANDS": [21.4, -157.8],
};

const parseCSV = (text) => {
  const rows = [];
  let row = [];
  let value = "";
  let quoted = false;

  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    const next = text[i + 1];

    if (ch === '"' && quoted && next === '"') {
      value += '"';
      i += 1;
    } else if (ch === '"') {
      quoted = !quoted;
    } else if (ch === "," && !quoted) {
      row.push(value.trim());
      value = "";
    } else if ((ch === "\n" || ch === "\r") && !quoted) {
      if (ch === "\r" && next === "\n") i += 1;
      row.push(value.trim());
      value = "";
      if (row.some((x) => x !== "")) rows.push(row);
      row = [];
    } else {
      value += ch;
    }
  }

  if (value !== "" || row.length) {
    row.push(value.trim());
    if (row.some((x) => x !== "")) rows.push(row);
  }

  if (!rows.length) return [];
  const headers = rows[0].map((h) => h.replace(/^\uFEFF/, ""));
  return rows.slice(1).map((cells) =>
    headers.reduce((obj, key, index) => {
      obj[key] = cells[index] ?? "";
      return obj;
    }, {})
  );
};

const getAISZone = (lat, lon) => {
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return "CENTRAL / INLAND";
  if (lon < -140 && lat < 30) return "HAWAII / PACIFIC ISLANDS";
  if (lon < -105) return "PACIFIC / WEST COAST";
  if (lat < 32 && lon >= -105 && lon <= -85) return "GULF COAST";
  if (lat < 32 && lon > -85) return "FLORIDA / ATLANTIC";
  if (lat >= 32 && lon > -85) return "ATLANTIC / NORTHEAST";
  return "CENTRAL / INLAND";
};

const riskFromMetrics = (records, vessels, avgSog, maxRecords, maxVessels, maxSog) => {
  if (!records) return 0;
  const activity = (records / Math.max(maxRecords, 1)) * 70;
  const vessel = (vessels / Math.max(maxVessels, 1)) * 30;
  const speed = Math.min((avgSog / Math.max(maxSog, 1)) * 20, 20);
  return Number((activity + vessel + speed).toFixed(1));
};

const predictionFromRisk = (risk) => {
  if (risk >= 70) return "HIGH";
  if (risk >= 40) return "MEDIUM";
  return "LOW";
};

const getMarkerIcon = () =>
  new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl:
      "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl:
      "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

const tooltipStyle = {
  background: "#111827",
  border: "1px solid #334155",
  borderRadius: 8,
  color: "#fff",
};

function GovernanceDashboard() {
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [simulation, setSimulation] = useState(false);
  const [logs, setLogs] = useState([]);
  const [aisRows, setAisRows] = useState([]);
  const [loadingAIS, setLoadingAIS] = useState(true);
  const [aisError, setAisError] = useState("");

  const runSimulation = () => {
    setSimulation(true);
    setLogs([]);

    const events = [
      "AIS signal ingestion started",
      "Zone intelligence analysis activated",
      "Risk state calculated",
      "Ministerial escalation workflow evaluated",
      "Field execution teams prepared",
      "Traffic and water response synchronized",
      "Governance decision recorded",
      "Replay snapshot generated",
      "Execution state stabilized",
    ];

    events.forEach((event, index) => {
      window.setTimeout(() => {
        setLogs((previous) => [...previous, event]);
      }, index * 900);
    });
  };

  useEffect(() => {
    let cancelled = false;

    const loadAIS = async () => {
      setLoadingAIS(true);
      setAisError("");

      const paths = ["/AIS_file.csv", "/AIS_file(5).csv"];

      try {
        let response = null;
        for (const path of paths) {
          try {
            const result = await fetch(path, { cache: "no-store" });
            if (result.ok) {
              response = result;
              break;
            }
          } catch {
            // Try the next path.
          }
        }

        if (!response) {
          throw new Error(
            "AIS CSV not found. Put AIS_file.csv inside frontend/public."
          );
        }

        const text = await response.text();
        const parsed = parseCSV(text);

        const cleaned = parsed
          .map((row) => ({
            MMSI: String(row.MMSI ?? "").trim(),
            BaseDateTime: String(row.BaseDateTime ?? "").trim(),
            LAT: Number(row.LAT),
            LON: Number(row.LON),
            SOG: Number(row.SOG),
            VesselType: String(row.VesselType ?? "").trim(),
          }))
          .filter(
            (row) =>
              row.MMSI &&
              Number.isFinite(row.LAT) &&
              Number.isFinite(row.LON) &&
              Number.isFinite(row.SOG)
          );

        if (!cancelled) {
          setAisRows(cleaned);
        }
      } catch (error) {
        if (!cancelled) {
          console.error("AIS loading error:", error);
          setAisError(error.message);
          setAisRows([]);
        }
      } finally {
        if (!cancelled) setLoadingAIS(false);
      }
    };

    loadAIS();
    return () => {
      cancelled = true;
    };
  }, []);

  const zoneData = useMemo(() => {
    const groups = {};
    AIS_ZONE_NAMES.forEach((name) => {
      groups[name] = {
        zone: name,
        records: 0,
        vessels: new Set(),
        vesselTypes: new Set(),
        sogTotal: 0,
        moving: 0,
        latTotal: 0,
        lonTotal: 0,
      };
    });

    aisRows.forEach((row) => {
      const zone = getAISZone(row.LAT, row.LON);
      const item = groups[zone];
      if (!item) return;

      item.records += 1;
      item.vessels.add(row.MMSI);
      if (row.VesselType) item.vesselTypes.add(row.VesselType);
      item.sogTotal += row.SOG;
      if (row.SOG > 0.5) item.moving += 1;
      item.latTotal += row.LAT;
      item.lonTotal += row.LON;
    });

    const raw = Object.values(groups).map((item) => ({
      zone: item.zone,
      records: item.records,
      vessels: item.vessels.size,
      vesselTypes: item.vesselTypes.size,
      avgSog: item.records
        ? Number((item.sogTotal / item.records).toFixed(2))
        : 0,
      movingPct: item.records
        ? Number(((item.moving / item.records) * 100).toFixed(1))
        : 0,
      lat: item.records ? item.latTotal / item.records : zoneCenter[item.zone][0],
      lon: item.records ? item.lonTotal / item.records : zoneCenter[item.zone][1],
    }));

    const maxRecords = Math.max(...raw.map((x) => x.records), 1);
    const maxVessels = Math.max(...raw.map((x) => x.vessels), 1);
    const maxSog = Math.max(...raw.map((x) => x.avgSog), 1);

    return raw.map((item) => {
      const risk = riskFromMetrics(
        item.records,
        item.vessels,
        item.avgSog,
        maxRecords,
        maxVessels,
        maxSog
      );

      return {
        ...item,
        risk,
        prediction: predictionFromRisk(risk),
      };
    });
  }, [aisRows]);

  const totalVessels = useMemo(
    () => new Set(aisRows.map((row) => row.MMSI)).size,
    [aisRows]
  );

  const totalRecords = aisRows.length;

  const predictionData = useMemo(() => {
    const counts = { HIGH: 0, MEDIUM: 0, LOW: 0 };
    zoneData.forEach((zone) => {
      counts[zone.prediction] += 1;
    });

    return [
      { name: "HIGH", value: counts.HIGH },
      { name: "MEDIUM", value: counts.MEDIUM },
      { name: "LOW", value: counts.LOW },
    ];
  }, [zoneData]);

  const zoneRiskData = zoneData.map((zone) => ({
    zone: zone.zone,
    risk: zone.risk,
  }));

  const incidentTrend = [
    { day: "Mon", incidents: 12 },
    { day: "Tue", incidents: 18 },
    { day: "Wed", incidents: 10 },
    { day: "Thu", incidents: 25 },
    { day: "Fri", incidents: 17 },
    { day: "Sat", incidents: 30 },
    { day: "Sun", incidents: 20 },
  ];

  const severityData = [
    { name: "Critical", value: 10 },
    { name: "High", value: 20 },
    { name: "Medium", value: 40 },
    { name: "Low", value: 30 },
  ];

  const escalationZoneData = zoneData.map((zone) => ({
    zone: zone.zone,
    escalations: Math.max(0, Math.round(zone.risk / 12)),
  }));

  const escalationTrend = [
    { day: "Mon", escalations: 4 },
    { day: "Tue", escalations: 7 },
    { day: "Wed", escalations: 5 },
    { day: "Thu", escalations: 9 },
    { day: "Fri", escalations: 6 },
    { day: "Sat", escalations: 11 },
    { day: "Sun", escalations: 8 },
  ];

  const fieldZoneData = zoneData.map((zone) => ({
    zone: zone.zone,
    tasks: Math.max(0, Math.round(zone.records / Math.max(totalRecords, 1) * 20)),
  }));

  const replayTrend = [
    { time: "10:00", risk: 28, confidence: 82 },
    { time: "10:15", risk: 36, confidence: 84 },
    { time: "10:30", risk: 52, confidence: 87 },
    { time: "10:45", risk: 71, confidence: 91 },
    { time: "11:00", risk: 86, confidence: 94 },
    { time: "11:15", risk: 63, confidence: 92 },
    { time: "11:30", risk: 42, confidence: 96 },
  ];

  const replayStateData = [
    { name: "LOW", value: 3 },
    { name: "MEDIUM", value: 4 },
    { name: "HIGH", value: 2 },
  ];

  const replayZoneData = zoneData.map((zone) => ({
    zone: zone.zone,
    snapshots: Math.max(1, Math.round(zone.records / Math.max(totalRecords, 1) * 20)),
  }));

  const renderZoneTick = ({ x, y, payload }) => {
    const words = String(payload.value).split(" / ");
    return (
      <text
        x={x}
        y={y + 15}
        textAnchor="middle"
        fill="#cbd5e1"
        fontSize={10}
        fontWeight={600}
      >
        {words.map((word, index) => (
          <tspan key={word} x={x} dy={index === 0 ? 0 : 14}>
            {word}
          </tspan>
        ))}
      </text>
    );
  };

  const chartCard = (title, children, className = "") => (
    <div
      className={`chart-card ${className}`}
      style={{
        background: "#111827",
        borderRadius: 16,
        padding: "22px 22px 16px",
        minWidth: 0,
        height: 470,
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
        border: "1px solid #26364d",
      }}
    >
      <h2
        style={{
          color: "#fff",
          fontSize: 25,
          margin: "0 0 14px",
        }}
      >
        {title}
      </h2>
      <div style={{ flex: 1, minHeight: 0 }}>{children}</div>
    </div>
  );

  const renderDashboard = () => (
    <div>
      <div style={styles.topbar}>
        <div>
          <h1 style={styles.title}>UCCIS Governance Dashboard</h1>
          <p style={styles.subtitle}>
            AIS-backed Ministerial Intelligence & Governance System
          </p>
        </div>
        <button style={styles.primaryButton} onClick={runSimulation}>
          {simulation ? "Run Simulation Again" : "Run Ministerial Simulation"}
        </button>
      </div>

      {simulation && (
        <div style={styles.feed}>
          <h2 style={{ color: "#22d3ee", marginTop: 0 }}>
            Live Ministerial Simulation
          </h2>
          {logs.length === 0 ? (
            <div style={styles.feedItem}>Starting simulation...</div>
          ) : (
            logs.map((log, index) => (
              <div style={styles.feedItem} key={`${log}-${index}`}>
                {log}
              </div>
            ))
          )}
        </div>
      )}

      {loadingAIS && (
        <div style={styles.infoBox}>Loading AIS intelligence data...</div>
      )}

      {aisError && (
        <div style={styles.errorBox}>
          <strong>AIS data error:</strong> {aisError}
          <br />
          Copy your CSV into <code>frontend/public/AIS_file.csv</code>.
        </div>
      )}

      <div style={styles.kpiGrid}>
        <KPI title="AIS RECORDS" value={totalRecords.toLocaleString()} subtitle="Loaded observations" />
        <KPI title="UNIQUE VESSELS" value={totalVessels.toLocaleString()} subtitle="Distinct MMSI values" />
        <KPI title="ACTIVE ZONES" value={zoneData.filter((z) => z.records > 0).length} subtitle="AIS geographic zones" />
        <KPI title="HIGH RISK ZONES" value={zoneData.filter((z) => z.prediction === "HIGH").length} subtitle="Risk ≥ 70" />
      </div>

      <div style={styles.chartGrid}>
        {chartCard(
          "Incident Trend Analysis",
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={incidentTrend} margin={{ top: 15, right: 20, left: 5, bottom: 35 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis
                dataKey="day"
                tick={{ fill: "#cbd5e1", fontSize: 13 }}
                axisLine={{ stroke: "#475569" }}
                tickLine={false}
                label={{ value: "Day", position: "insideBottom", offset: -20, fill: "#fff", fontSize: 14, fontWeight: 700 }}
              />
              <YAxis
                domain={[0, 35]}
                tick={{ fill: "#cbd5e1", fontSize: 12 }}
                axisLine={{ stroke: "#475569" }}
                tickLine={false}
                label={{ value: "Incident Count", angle: -90, position: "insideLeft", fill: "#fff", fontSize: 14, fontWeight: 700 }}
              />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="incidents" stroke="#00BFFF" strokeWidth={4} dot={{ r: 5, fill: "#00BFFF", stroke: "#fff", strokeWidth: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        )}

        {chartCard(
          "Severity Distribution",
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={severityData} dataKey="value" nameKey="name" cx="50%" cy="48%" innerRadius={55} outerRadius={125} label>
                {severityData.map((entry, index) => (
                  <Cell key={entry.name} fill={COLORS[index]} stroke="#fff" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}

        {chartCard(
          "AIS Zone Risk Comparison",
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={zoneRiskData} margin={{ top: 20, right: 20, left: 5, bottom: 75 }} barCategoryGap="18%">
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="zone" interval={0} height={75} tick={renderZoneTick} tickLine={false} axisLine={{ stroke: "#475569" }} />
              <YAxis domain={[0, 120]} ticks={[0, 20, 40, 60, 80, 100, 120]} tick={{ fill: "#cbd5e1", fontSize: 12 }} axisLine={{ stroke: "#475569" }} tickLine={false} label={{ value: "Risk Score", angle: -90, position: "insideLeft", fill: "#fff", fontSize: 14, fontWeight: 700 }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="risk" name="Risk Score" fill="#18b4eb" radius={[8, 8, 0, 0]} barSize={42} />
            </BarChart>
          </ResponsiveContainer>
        )}

        {chartCard(
          "Governance Intelligence Feed",
          <div style={{ overflowY: "auto" }}>
            {[
              "AIS signals loaded for governance analysis",
              "Zone risk scores recalculated from vessel activity",
              "High-risk zone monitoring activated",
              "Escalation workflow ready for ministerial review",
              "Replay state available for historical reconstruction",
            ].map((item) => (
              <div key={item} style={styles.feedItem}>
                {item}
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ ...styles.mapBox, height: 430 }}>
        <h2 style={styles.mapTitle}>AIS Zone Intelligence Map</h2>
        <MapContainer center={[34, -96]} zoom={4} style={{ height: "100%", width: "100%" }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {zoneData
            .filter((zone) => zone.records > 0)
            .map((zone) => (
              <Marker
                key={zone.zone}
                position={[zone.lat, zone.lon]}
                icon={getMarkerIcon()}
              >
                <Popup>
                  <strong>{zone.zone}</strong>
                  <br />
                  AIS Records: {zone.records}
                  <br />
                  Vessels: {zone.vessels}
                  <br />
                  Avg SOG: {zone.avgSog}
                  <br />
                  Risk: {zone.risk}
                  <br />
                  Prediction: {zone.prediction}
                </Popup>
              </Marker>
            ))}
        </MapContainer>
      </div>
    </div>
  );

  const renderTask10 = () => (
    <div>
      <PageHeader
        title="Escalation Management"
        subtitle="UCCIS Ministerial Escalation & Governance Response"
      />

      <div style={styles.kpiGrid}>
        <KPI title="ACTIVE ESCALATIONS" value="08" subtitle="Currently under monitoring" />
        <KPI title="CRITICAL ESCALATIONS" value="03" subtitle="Immediate intervention required" accent="#ef4444" />
        <KPI title="PENDING APPROVAL" value="02" subtitle="Awaiting ministerial decision" accent="#f59e0b" />
        <KPI title="RESOLVED" value="12" subtitle="Successfully closed" accent="#22c55e" />
      </div>

      <div style={styles.chartGrid}>
        {chartCard(
          "Escalation Status Distribution",
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={[{ name: "Critical", value: 3 }, { name: "High", value: 5 }, { name: "Medium", value: 7 }, { name: "Resolved", value: 12 }]} dataKey="value" nameKey="name" cx="50%" cy="48%" innerRadius={70} outerRadius={125} label>
                {[0, 1, 2, 3].map((index) => <Cell key={index} fill={COLORS[index]} />)}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}

        {chartCard(
          "Escalations by Zone",
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={escalationZoneData} margin={{ top: 20, right: 20, left: 5, bottom: 80 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="zone" interval={0} height={80} tick={renderZoneTick} tickLine={false} axisLine={{ stroke: "#475569" }} />
              <YAxis tick={{ fill: "#cbd5e1" }} axisLine={{ stroke: "#475569" }} tickLine={false} label={{ value: "Escalation Count", angle: -90, position: "insideLeft", fill: "#fff", fontWeight: 700 }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="escalations" fill="#18b4eb" radius={[8, 8, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {chartCard(
        "Escalation Trend Analysis",
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={escalationTrend} margin={{ top: 20, right: 25, left: 5, bottom: 35 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="day" tick={{ fill: "#cbd5e1" }} axisLine={{ stroke: "#475569" }} tickLine={false} label={{ value: "Day", position: "insideBottom", offset: -20, fill: "#fff", fontWeight: 700 }} />
            <YAxis tick={{ fill: "#cbd5e1" }} axisLine={{ stroke: "#475569" }} tickLine={false} label={{ value: "Escalation Count", angle: -90, position: "insideLeft", fill: "#fff", fontWeight: 700 }} />
            <Tooltip contentStyle={tooltipStyle} />
            <Line type="monotone" dataKey="escalations" stroke="#18b4eb" strokeWidth={4} dot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>,
        "fullWidth"
      )}

      <ActivityTable />
    </div>
  );

  const renderFieldExecution = () => (
    <div>
      <PageHeader
        title="Field Execution Management"
        subtitle="UCCIS Field Operations & Governance Response"
      />

      <div style={styles.kpiGrid}>
        <KPI title="ACTIVE OPERATIONS" value="08" subtitle="Currently deployed" />
        <KPI title="IN PROGRESS" value="06" subtitle="Field teams executing" accent="#18b4eb" />
        <KPI title="COMPLETED" value="12" subtitle="Successfully completed" accent="#22c55e" />
        <KPI title="DELAYED" value="02" subtitle="Requires attention" accent="#ef4444" />
      </div>

      <div style={styles.chartGrid}>
        {chartCard(
          "Execution Status Distribution",
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={[{ name: "Dispatched", value: 8 }, { name: "In Progress", value: 6 }, { name: "Completed", value: 12 }, { name: "Delayed", value: 2 }]} dataKey="value" nameKey="name" cx="50%" cy="48%" innerRadius={70} outerRadius={125} label>
                <Cell fill="#18b4eb" /><Cell fill="#f59e0b" /><Cell fill="#22c55e" /><Cell fill="#ef4444" />
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}

        {chartCard(
          "Field Operations by Zone",
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={fieldZoneData} margin={{ top: 20, right: 20, left: 5, bottom: 80 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="zone" interval={0} height={80} tick={renderZoneTick} tickLine={false} axisLine={{ stroke: "#475569" }} />
              <YAxis tick={{ fill: "#cbd5e1" }} axisLine={{ stroke: "#475569" }} tickLine={false} label={{ value: "Execution Count", angle: -90, position: "insideLeft", fill: "#fff", fontWeight: 700 }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="tasks" name="Executions" fill="#18b4eb" radius={[8, 8, 0, 0]} barSize={42} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <ActivityTable title="Live Field Operations" />
    </div>
  );

  const renderReplay = () => (
    <div>
      <PageHeader
        title="Replay View"
        subtitle="UCCIS State Reconstruction & Historical Intelligence Replay"
      />

      <div style={styles.kpiGrid}>
        <KPI title="TOTAL SNAPSHOTS" value="09" subtitle="Historical states captured" />
        <KPI title="PEAK RISK" value="86" subtitle="Highest reconstructed risk" accent="#ef4444" />
        <KPI title="CONFIDENCE" value="96%" subtitle="Replay confidence score" accent="#18b4eb" />
        <KPI title="FINAL STATE" value="LOW" subtitle="System stabilized" accent="#22c55e" />
      </div>

      <div style={styles.chartGrid}>
        {chartCard(
          "Risk & Confidence Replay",
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={replayTrend} margin={{ top: 20, right: 25, left: 5, bottom: 35 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="time" tick={{ fill: "#cbd5e1" }} axisLine={{ stroke: "#475569" }} tickLine={false} label={{ value: "Replay Time", position: "insideBottom", offset: -20, fill: "#fff", fontWeight: 700 }} />
              <YAxis domain={[0, 100]} tick={{ fill: "#cbd5e1" }} axisLine={{ stroke: "#475569" }} tickLine={false} label={{ value: "Score", angle: -90, position: "insideLeft", fill: "#fff", fontWeight: 700 }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend />
              <Line type="monotone" dataKey="risk" name="Risk Score" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="confidence" name="Confidence" stroke="#18b4eb" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        )}

        {chartCard(
          "Reconstructed State Distribution",
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={replayStateData} dataKey="value" nameKey="name" cx="50%" cy="48%" innerRadius={65} outerRadius={115} label>
                <Cell fill="#22c55e" /><Cell fill="#f59e0b" /><Cell fill="#ef4444" />
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      {chartCard(
        "Replay Snapshots by Zone",
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={replayZoneData} margin={{ top: 20, right: 20, left: 5, bottom: 80 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="zone" interval={0} height={80} tick={renderZoneTick} tickLine={false} axisLine={{ stroke: "#475569" }} />
            <YAxis tick={{ fill: "#cbd5e1" }} axisLine={{ stroke: "#475569" }} tickLine={false} label={{ value: "Snapshot Count", angle: -90, position: "insideLeft", fill: "#fff", fontWeight: 700 }} />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="snapshots" name="Snapshots" fill="#18b4eb" radius={[8, 8, 0, 0]} barSize={45} />
          </BarChart>
        </ResponsiveContainer>,
        "fullWidth"
      )}

      <div style={styles.timelineCard}>
        <h2>Replay Timeline</h2>
        {[
          ["10:00", "Baseline State Captured", "Risk 28 · Confidence 82% · LOW"],
          ["10:30", "Risk State Increased", "Risk 52 · Confidence 87% · MEDIUM"],
          ["11:00", "Critical State Reconstructed", "Risk 86 · Confidence 94% · HIGH"],
          ["11:30", "System Stabilized", "Risk 42 · Confidence 96%"],
        ].map(([time, title, description]) => (
          <div style={styles.timelineRow} key={time}>
            <strong>{time}</strong>
            <span style={styles.timelineDot} />
            <div>
              <strong>{title}</strong>
              <div style={{ color: "#94a3b8", marginTop: 4 }}>{description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div style={styles.app}>
      <aside style={styles.sidebar}>
        <h2 style={{ marginTop: 0, color: "#fff" }}>UCCIS</h2>

        {[
          ["dashboard", "Dashboard"],
          ["escalation", "Escalation"],
          ["execution", "Field Execution"],
          ["replay", "Replay View"],
        ].map(([key, label]) => (
          <button
            key={key}
            onClick={() => setActiveMenu(key)}
            style={{
              ...styles.menuButton,
              ...(activeMenu === key ? styles.menuActive : {}),
            }}
          >
            {label}
          </button>
        ))}
      </aside>

      <main style={styles.main}>
        {activeMenu === "dashboard" && renderDashboard()}
        {activeMenu === "escalation" && renderTask10()}
        {activeMenu === "execution" && renderFieldExecution()}
        {activeMenu === "replay" && renderReplay()}
      </main>
    </div>
  );
}

function KPI({ title, value, subtitle, accent = "#18b4eb" }) {
  return (
    <div
      style={{
        ...styles.kpi,
        borderTop: `3px solid ${accent}`,
      }}
    >
      <div style={styles.kpiTitle}>{title}</div>
      <div style={{ ...styles.kpiValue, color: accent }}>{value}</div>
      <div style={styles.kpiSubtitle}>{subtitle}</div>
    </div>
  );
}

function PageHeader({ title, subtitle }) {
  return (
    <div style={styles.pageHeader}>
      <div>
        <h1 style={styles.title}>{title}</h1>
        <p style={styles.subtitle}>{subtitle}</p>
      </div>
    </div>
  );
}

function ActivityTable({ title = "Recent Escalation Activity" }) {
  const rows = [
    ["Gulf Coast", "AIS activity escalation detected", "CRITICAL", "ACTIVE"],
    ["Pacific / West Coast", "Vessel activity deviation", "HIGH", "ACTIVE"],
    ["Atlantic / Northeast", "Ministerial review requested", "HIGH", "PENDING"],
    ["Florida / Atlantic", "Traffic activity escalation", "MEDIUM", "RESOLVED"],
  ];

  return (
    <div style={styles.activity}>
      <h2 style={{ color: "#fff", marginTop: 0 }}>{title}</h2>
      <div style={styles.tableHeader}>
        <span>ZONE</span>
        <span>EVENT</span>
        <span>SEVERITY</span>
        <span>STATUS</span>
      </div>

      {rows.map((row) => (
        <div style={styles.tableRow} key={row.join("-")}>
          <span>{row[0]}</span>
          <span>{row[1]}</span>
          <span style={{ fontWeight: 800 }}>{row[2]}</span>
          <span style={{ color: row[3] === "ACTIVE" ? "#22c55e" : "#f59e0b", fontWeight: 800 }}>
            {row[3]}
          </span>
        </div>
      ))}
    </div>
  );
}

const styles = {
  app: {
    minHeight: "100vh",
    display: "flex",
    background: "#0f172a",
    color: "#e5e7eb",
    fontFamily: "Arial, sans-serif",
  },
  sidebar: {
    width: 220,
    minHeight: "100vh",
    background: "#0b1220",
    borderRight: "1px solid #26364d",
    padding: 20,
    boxSizing: "border-box",
    position: "sticky",
    top: 0,
    alignSelf: "flex-start",
  },
  menuButton: {
    width: "100%",
    textAlign: "left",
    border: "none",
    background: "transparent",
    color: "#94a3b8",
    padding: "13px 12px",
    marginBottom: 6,
    borderRadius: 8,
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 700,
  },
  menuActive: {
    background: "#1e40af",
    color: "#fff",
  },
  main: {
    flex: 1,
    minWidth: 0,
    padding: 24,
    boxSizing: "border-box",
  },
  topbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 20,
    flexWrap: "wrap",
    marginBottom: 20,
  },
  pageHeader: {
    marginBottom: 20,
  },
  title: {
    margin: 0,
    color: "#fff",
    fontSize: 30,
    fontWeight: 800,
  },
  subtitle: {
    color: "#94a3b8",
    margin: "6px 0 0",
  },
  primaryButton: {
    border: "none",
    borderRadius: 8,
    padding: "12px 18px",
    background: "#0284c7",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 800,
  },
  kpiGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
    gap: 15,
    marginBottom: 20,
  },
  kpi: {
    background: "#111827",
    borderRadius: 12,
    padding: 18,
    minWidth: 0,
    border: "1px solid #26364d",
  },
  kpiTitle: {
    color: "#94a3b8",
    fontSize: 12,
    fontWeight: 800,
  },
  kpiValue: {
    fontSize: 28,
    fontWeight: 900,
    margin: "8px 0",
  },
  kpiSubtitle: {
    color: "#64748b",
    fontSize: 12,
  },
  chartGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 18,
    marginBottom: 18,
  },
  feed: {
    background: "#111827",
    border: "1px solid #26364d",
    borderRadius: 12,
    padding: 18,
    marginBottom: 20,
  },
  feedItem: {
    padding: "10px 12px",
    marginBottom: 7,
    background: "#0f172a",
    borderLeft: "3px solid #18b4eb",
    borderRadius: 6,
    color: "#cbd5e1",
  },
  infoBox: {
    background: "#0c4a6e",
    color: "#bae6fd",
    border: "1px solid #0369a1",
    padding: 14,
    borderRadius: 8,
    marginBottom: 15,
  },
  errorBox: {
    background: "#450a0a",
    color: "#fecaca",
    border: "1px solid #991b1b",
    padding: 14,
    borderRadius: 8,
    marginBottom: 15,
  },
  mapBox: {
    background: "#111827",
    border: "1px solid #26364d",
    borderRadius: 16,
    padding: 15,
    marginTop: 18,
    boxSizing: "border-box",
    overflow: "hidden",
  },
  mapTitle: {
    margin: "0 0 12px",
    color: "#fff",
  },
  activity: {
    background: "#111827",
    border: "1px solid #26364d",
    borderRadius: 16,
    padding: 20,
    marginTop: 18,
  },
  tableHeader: {
    display: "grid",
    gridTemplateColumns: "1fr 2fr 1fr 1fr",
    gap: 10,
    color: "#64748b",
    fontSize: 11,
    fontWeight: 800,
    padding: "10px 0",
    borderBottom: "1px solid #334155",
  },
  tableRow: {
    display: "grid",
    gridTemplateColumns: "1fr 2fr 1fr 1fr",
    gap: 10,
    padding: "14px 0",
    borderBottom: "1px solid #1e293b",
    color: "#cbd5e1",
    fontSize: 13,
  },
  timelineCard: {
    background: "#111827",
    border: "1px solid #26364d",
    borderRadius: 16,
    padding: 20,
    marginTop: 18,
  },
  timelineRow: {
    display: "grid",
    gridTemplateColumns: "70px 18px 1fr",
    gap: 14,
    alignItems: "start",
    padding: "14px 0",
    borderBottom: "1px solid #1e293b",
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: "50%",
    background: "#18b4eb",
    marginTop: 4,
    boxShadow: "0 0 10px rgba(24,180,235,.6)",
  },
};

export default GovernanceDashboard;
