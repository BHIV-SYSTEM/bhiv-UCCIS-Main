// Dashboard.jsx
// AIS-integrated Task 21 Governance Command Center

import React, { useEffect, useMemo, useState } from "react";
import "../dashboard/Task21.css";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";

import {
  Activity,
  AlertTriangle,
  ShieldCheck,
  Users,
  Radio,
  Database,
  Server,
  Globe,
  Wifi,
} from "lucide-react";

const AIS_FILE = "/AIS_file.csv";

const clamp = (value, min = 0, max = 100) =>
  Math.max(min, Math.min(max, Number(value) || 0));

const toNumber = (value) => {
  const n = Number(String(value ?? "").trim());
  return Number.isFinite(n) ? n : null;
};

const parseCSVLine = (line) => {
  const result = [];
  let current = "";
  let quoted = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];

    if (char === '"') {
      if (quoted && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        quoted = !quoted;
      }
    } else if (char === "," && !quoted) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
};

const parseAISCSV = (csv) => {
  const lines = String(csv || "")
    .replace(/^\uFEFF/, "")
    .split(/\r?\n/)
    .filter((line) => line.trim());

  if (lines.length < 2) return [];

  const headers = parseCSVLine(lines[0]).map((header) =>
    header.replace(/^"|"$/g, "").trim()
  );

  return lines.slice(1).map((line) => {
    const values = parseCSVLine(line);
    return headers.reduce((row, header, index) => {
      row[header] = values[index] ?? "";
      return row;
    }, {});
  });
};

const getField = (row, names) => {
  const keys = Object.keys(row || {});
  const wanted = names.map((name) => name.toLowerCase());

  const key = keys.find((candidate) =>
    wanted.includes(String(candidate).trim().toLowerCase())
  );

  return key ? row[key] : "";
};

const normalizeAIS = (row) => ({
  mmsi: String(getField(row, ["MMSI", "mmsi"])).trim(),
  timestamp: String(
    getField(row, ["BaseDateTime", "BaseDateTime", "timestamp", "time"])
  ).trim(),
  lat: toNumber(getField(row, ["LAT", "Latitude", "latitude"])),
  lon: toNumber(getField(row, ["LON", "Longitude", "longitude"])),
  sog: toNumber(getField(row, ["SOG", "Speed", "speed"])),
  vesselType: String(
    getField(row, ["VesselType", "Vessel Type", "vessel_type", "type"])
  ).trim(),
});

const emptyMetrics = {
  records: 0,
  vessels: 0,
  vesselTypes: 0,
  validCoordinates: 0,
  validSpeed: 0,
  validTimestamp: 0,
  movingRecords: 0,
  averageSOG: 0,
  coordinateQuality: 0,
  speedQuality: 0,
  timestampQuality: 0,
  overallQuality: 0,
};

const calculateAISMetrics = (rows) => {
  const normalized = rows.map(normalizeAIS);

  const vessels = new Set(
    normalized.map((row) => row.mmsi).filter(Boolean)
  );

  const vesselTypes = new Set(
    normalized.map((row) => row.vesselType).filter(Boolean)
  );

  const validCoordinates = normalized.filter(
    (row) =>
      Number.isFinite(row.lat) &&
      Number.isFinite(row.lon) &&
      row.lat >= -90 &&
      row.lat <= 90 &&
      row.lon >= -180 &&
      row.lon <= 180
  ).length;

  const validSpeedRows = normalized.filter(
    (row) => Number.isFinite(row.sog) && row.sog >= 0
  );

  const validTimestamp = normalized.filter(
    (row) => row.timestamp && !Number.isNaN(Date.parse(row.timestamp))
  ).length;

  const movingRecords = validSpeedRows.filter((row) => row.sog > 0).length;

  const averageSOG =
    validSpeedRows.length > 0
      ? validSpeedRows.reduce((sum, row) => sum + row.sog, 0) /
        validSpeedRows.length
      : 0;

  const records = normalized.length;

  const coordinateQuality =
    records > 0 ? (validCoordinates / records) * 100 : 0;
  const speedQuality =
    records > 0 ? (validSpeedRows.length / records) * 100 : 0;
  const timestampQuality =
    records > 0 ? (validTimestamp / records) * 100 : 0;

  const overallQuality =
    records > 0
      ? Math.round(
          (coordinateQuality + speedQuality + timestampQuality) / 3
        )
      : 0;

  return {
    records,
    vessels: vessels.size,
    vesselTypes: vesselTypes.size,
    validCoordinates,
    validSpeed: validSpeedRows.length,
    validTimestamp,
    movingRecords,
    averageSOG,
    coordinateQuality,
    speedQuality,
    timestampQuality,
    overallQuality,
  };
};

const buildTrendData = (rows) => {
  if (!rows.length) {
    return [
      { day: "Mon", alerts: 0 },
      { day: "Tue", alerts: 0 },
      { day: "Wed", alerts: 0 },
      { day: "Thu", alerts: 0 },
      { day: "Fri", alerts: 0 },
      { day: "Sat", alerts: 0 },
      { day: "Sun", alerts: 0 },
    ];
  }

  const buckets = Array.from({ length: 7 }, () => 0);
  rows.forEach((row, index) => {
    const sog = Number.isFinite(row.sog) ? row.sog : 0;
    const signal = Math.max(0, Math.round(sog * 3));
    buckets[index % 7] += signal;
  });

  const max = Math.max(...buckets, 1);

  return buckets.map((value, index) => ({
    day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index],
    alerts: Math.max(1, Math.round((value / max) * 15)),
  }));
};

const buildTelemetryData = (rows) => {
  if (!rows.length) {
    return [
      { time: "10AM", cpu: 0 },
      { time: "11AM", cpu: 0 },
      { time: "12PM", cpu: 0 },
      { time: "1PM", cpu: 0 },
      { time: "2PM", cpu: 0 },
      { time: "3PM", cpu: 0 },
      { time: "4PM", cpu: 0 },
    ];
  }

  const buckets = Array.from({ length: 7 }, () => []);
  rows.forEach((row, index) => {
    if (Number.isFinite(row.sog)) buckets[index % 7].push(row.sog);
  });

  const labels = ["10AM", "11AM", "12PM", "1PM", "2PM", "3PM", "4PM"];

  return buckets.map((bucket, index) => {
    const avg =
      bucket.length > 0
        ? bucket.reduce((sum, value) => sum + value, 0) / bucket.length
        : 0;

    return {
      time: labels[index],
      cpu: Math.round(clamp(avg * 20, 0, 100)),
    };
  });
};

function SystemOperational() {
  const [aisRows, setAisRows] = useState([]);
  const [aisError, setAisError] = useState("");

  useEffect(() => {
    let mounted = true;

    fetch(AIS_FILE, { cache: "no-store" })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`AIS_file.csv returned ${response.status}`);
        }
        return response.text();
      })
      .then((csv) => {
        if (!mounted) return;
        setAisRows(parseAISCSV(csv));
      })
      .catch((error) => {
        if (!mounted) return;
        setAisError(error.message || "Unable to load AIS_file.csv");
        setAisRows([]);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const normalizedRows = useMemo(
    () => aisRows.map(normalizeAIS),
    [aisRows]
  );

  const metrics = useMemo(
    () => calculateAISMetrics(aisRows),
    [aisRows]
  );

  const operationalData = useMemo(
    () => buildTrendData(normalizedRows),
    [normalizedRows]
  );

  const telemetryData = useMemo(
    () => buildTelemetryData(normalizedRows),
    [normalizedRows]
  );

  const systemHealth = metrics.records
    ? Math.round(
        clamp(
          metrics.overallQuality * 0.65 +
            clamp(metrics.movingRecords / Math.max(metrics.records, 1) * 100) *
              0.15 +
            clamp(metrics.vessels / Math.max(metrics.records, 1) * 100) * 0.2
        )
      )
    : 0;

  const activeOperators = metrics.vessels;

  const escalationLevel =
    metrics.records === 0
      ? "OFFLINE"
      : metrics.overallQuality >= 90
      ? "LOW"
      : metrics.overallQuality >= 70
      ? "MEDIUM"
      : "HIGH";

  const escalationDistrictCount = metrics.records
    ? Math.max(
        1,
        Math.min(
          9,
          Math.round(
            (metrics.movingRecords / Math.max(metrics.records, 1)) * 9
          )
        )
      )
    : 0;

  const alerts = useMemo(() => {
    if (!metrics.records) {
      return [
        {
          title: "AIS telemetry unavailable",
          location: "Check frontend/public/AIS_file.csv",
          level: "HIGH",
        },
        {
          title: "Telemetry processing waiting",
          location: "No AIS records loaded",
          level: "MEDIUM",
        },
        {
          title: "Data quality review pending",
          location: "AIS source not connected",
          level: "LOW",
        },
      ];
    }

    return [
      {
        title: "AIS Activity Monitoring",
        location: `${metrics.movingRecords.toLocaleString()} moving records detected`,
        level: metrics.movingRecords > 0 ? "HIGH" : "LOW",
      },
      {
        title: "Coordinate Telemetry",
        location: `${metrics.validCoordinates.toLocaleString()} valid coordinate records`,
        level: metrics.coordinateQuality >= 90 ? "MEDIUM" : "HIGH",
      },
      {
        title: "Timestamp Validation",
        location: `${metrics.validTimestamp.toLocaleString()} valid timestamp records`,
        level: metrics.timestampQuality >= 90 ? "LOW" : "MEDIUM",
      },
    ];
  }, [metrics]);

  const departments = useMemo(() => {
    const q = metrics.overallQuality;

    return [
      {
        name: "Police",
        status: q >= 85 ? "ACTIVE" : "HIGH LOAD",
        load: `${Math.round(clamp(q + 3))}%`,
      },
      {
        name: "Medical",
        status: q >= 80 ? "STABLE" : "HIGH LOAD",
        load: `${Math.round(clamp(q - 2))}%`,
      },
      {
        name: "Fire",
        status: q >= 70 ? "STABLE" : "HIGH LOAD",
        load: `${Math.round(clamp(q - 8))}%`,
      },
      {
        name: "Cyber",
        status: q < 60 ? "CRITICAL" : q < 80 ? "HIGH LOAD" : "ACTIVE",
        load: `${Math.round(clamp(q + 5))}%`,
      },
    ];
  }, [metrics.overallQuality]);

  const heatmap = useMemo(() => {
    const base = metrics.records
      ? Math.round(
          clamp(
            metrics.movingRecords / Math.max(metrics.records, 1) * 100
          )
        )
      : 0;

    return [
      { city: "Pune", value: clamp(base + 8) },
      { city: "Mumbai", value: clamp(base + 4) },
      { city: "Nashik", value: clamp(base - 2) },
      { city: "Nagpur", value: clamp(base + 6) },
      { city: "Thane", value: clamp(base + 10) },
      { city: "Satara", value: clamp(base - 6) },
      { city: "Kolhapur", value: clamp(base + 2) },
      { city: "Aurangabad", value: clamp(base - 4) },
      { city: "Solapur", value: clamp(base + 1) },
    ];
  }, [metrics]);

  const logs = useMemo(() => {
    if (!metrics.records) {
      return [
        "AIS source check initiated",
        "Telemetry connection waiting",
        "Data quality validation pending",
        "Operational replay waiting",
      ];
    }

    return [
      `${metrics.records.toLocaleString()} AIS records processed`,
      `${metrics.vessels.toLocaleString()} unique vessels identified`,
      `${metrics.movingRecords.toLocaleString()} moving records evaluated`,
      `Telemetry quality calculated at ${metrics.overallQuality}%`,
    ];
  }, [metrics]);

  const timelineTimes = ["10:00 AM", "10:15 AM", "10:45 AM", "11:10 AM"];

  return (
    <div className="dashboard">
      <header className="topbar">
        <div>
          <h1>UCCIS Governance Command Center</h1>
          <p>Unified Command &amp; Control Intelligence System</p>
        </div>
      </header>

      <section className="metrics-grid">
        <MetricCard
          icon={<AlertTriangle />}
          title="Critical Alerts"
          value={
            metrics.records
              ? Math.max(
                  1,
                  Math.round(
                    (metrics.records * (100 - metrics.overallQuality)) / 1000
                  )
                )
              : 0
          }
          sub={
            metrics.records
              ? `${metrics.movingRecords.toLocaleString()} moving AIS records`
              : "AIS data not loaded"
          }
          danger
        />

        <MetricCard
          icon={<Users />}
          title="Operators Active"
          value={activeOperators.toLocaleString()}
          sub={
            metrics.records
              ? `${metrics.vesselTypes} vessel types detected`
              : "Waiting for AIS data"
          }
        />

        <MetricCard
          icon={<Radio />}
          title="Escalation Level"
          value={escalationLevel}
          sub={
            metrics.records
              ? `Telemetry activity across ${escalationDistrictCount} monitoring bands`
              : "AIS telemetry offline"
          }
          warning
        />

        <MetricCard
          icon={<ShieldCheck />}
          title="System Health"
          value={`${systemHealth}%`}
          sub={
            metrics.records
              ? `${metrics.overallQuality}% overall AIS data quality`
              : "No AIS records available"
          }
          success
        />
      </section>

      <section className="main-grid">
        <div className="panel large-panel">
          <div className="panel-header">
            <h2>Operational Trend</h2>
          </div>

          <div style={{ width: "100%", height: "330px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={operationalData}
                margin={{ top: 10, right: 35, left: 10, bottom: 25 }}
                barCategoryGap="18%"
              >
                <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" />
                <XAxis
                  dataKey="day"
                  interval={0}
                  padding={{ left: 15, right: 15 }}
                  tick={{ fill: "#94a3b8", fontSize: 14 }}
                  label={{
                    value: "Day",
                    position: "insideBottom",
                    offset: -12,
                    fill: "#94a3b8",
                    fontSize: 14,
                    fontWeight: "600",
                  }}
                  stroke="#94a3b8"
                />
                <YAxis
                  domain={[0, 16]}
                  ticks={[0, 4, 8, 12, 16]}
                  tick={{ fill: "#94a3b8", fontSize: 14 }}
                  label={{
                    value: "Telemetry Activity",
                    angle: -90,
                    position: "insideLeft",
                    fill: "#94a3b8",
                    fontSize: 14,
                    fontWeight: "600",
                  }}
                  stroke="#94a3b8"
                />
                <Tooltip
                  contentStyle={{
                    background: "#081426",
                    border: "1px solid #1e293b",
                    borderRadius: "12px",
                  }}
                />
                <Bar
                  dataKey="alerts"
                  name="AIS Activity"
                  fill="#38bdf8"
                  radius={[12, 12, 0, 0]}
                  maxBarSize={58}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <h2>Live Telemetry</h2>
          </div>

          <div
            style={{
              width: "100%",
              height: "300px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={telemetryData}
                margin={{ top: 20, right: 20, left: 10, bottom: 10 }}
              >
                <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" />
                <XAxis
                  dataKey="time"
                  stroke="#94a3b8"
                  tick={{ fill: "#94a3b8" }}
                  label={{
                    value: "Time",
                    position: "insideBottom",
                    offset: -5,
                    fill: "#94a3b8",
                  }}
                />
                <YAxis
                  domain={[0, 100]}
                  stroke="#94a3b8"
                  tick={{ fill: "#94a3b8" }}
                  label={{
                    value: "AIS Telemetry Value",
                    angle: -90,
                    position: "insideLeft",
                    fill: "#94a3b8",
                  }}
                />
                <Tooltip
                  contentStyle={{
                    background: "#081426",
                    border: "1px solid #1e293b",
                    borderRadius: "12px",
                    color: "#ffffff",
                  }}
                  labelStyle={{ color: "#38bdf8" }}
                />
                <Line
                  type="monotone"
                  dataKey="cpu"
                  name="Telemetry"
                  stroke="#22c55e"
                  strokeWidth={4}
                  dot={{ r: 6, fill: "#22c55e" }}
                  activeDot={{ r: 8, fill: "#22c55e" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="secondary-grid">
        <div className="panel">
          <div className="panel-header">
            <h2>Escalation Heatmap</h2>
          </div>

          <div className="heatmap-grid">
            {heatmap.map((item, i) => (
              <div
                key={item.city}
                className={`heat-box ${
                  item.value >= 75
                    ? "danger-box"
                    : item.value >= 50
                    ? "warning-box"
                    : "safe-box"
                }`}
                title={`AIS-derived activity indicator: ${Math.round(
                  item.value
                )}%`}
              >
                {item.city}
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <h2>Department Performance</h2>
          </div>

          <table className="dept-table" style={{ color: "#000000" }}>
            <thead>
              <tr>
                <th>Department</th>
                <th>Status</th>
                <th>Load</th>
              </tr>
            </thead>

            <tbody>
              {departments.map((dept) => (
                <tr key={dept.name}>
                  <td style={{ color: "#000000" }}>{dept.name}</td>
                  <td
                    style={{ color: "#000000" }}
                    className={
                      dept.status === "ACTIVE"
                        ? "green"
                        : dept.status === "STABLE"
                        ? "blue"
                        : dept.status === "HIGH LOAD"
                        ? "yellow"
                        : "red"
                    }
                  >
                    {dept.status}
                  </td>
                  <td style={{ color: "#000000" }}>{dept.load}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <h2>Live Alert Feed</h2>
        </div>

        <div className="alerts-list">
          {alerts.map((alert, i) => (
            <div className="alert-item" key={`${alert.title}-${i}`}>
              <div>
                <h4>{alert.title}</h4>
                <p>{alert.location}</p>
              </div>

              <div
                className={`badge ${
                  alert.level === "HIGH"
                    ? "badge-red"
                    : alert.level === "MEDIUM"
                    ? "badge-yellow"
                    : "badge-green"
                }`}
              >
                {alert.level}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <h2>Operational Replay Timeline</h2>
        </div>

        <div className="timeline">
          {logs.map((item, i) => (
            <div className="timeline-item" key={`${item}-${i}`}>
              <div className="timeline-dot"></div>

              <div>
                <h5>{timelineTimes[i]}</h5>
                <p>{item}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {aisError && (
        <section className="panel">
          <div className="panel-header">
            <h2>Telemetry Status</h2>
          </div>
          <p style={{ color: "#dc2626", margin: 0 }}>
            {aisError}. Make sure <strong>AIS_file.csv</strong> is inside
            <strong> frontend/public/</strong>.
          </p>
        </section>
      )}
    </div>
  );
}

function MetricCard({
  icon,
  title,
  value,
  sub,
  danger,
  warning,
  success,
}) {
  return (
    <div className="metric-card">
      <div className="metric-top">
        <div className="metric-icon">{icon}</div>
        <Activity size={18} className="mini-pulse" />
      </div>

      <p>{title}</p>

      <h2
        className={
          danger
            ? "danger-text"
            : warning
            ? "warning-text"
            : success
            ? "success-text"
            : ""
        }
      >
        {value}
      </h2>

      <span>{sub}</span>
    </div>
  );
}

function Service({ name, icon }) {
  return (
    <div className="service-item">
      <div className="service-left">
        {icon}
        <span>{name}</span>
      </div>
      <span className="green">Operational</span>
    </div>
  );
}

export default SystemOperational;
