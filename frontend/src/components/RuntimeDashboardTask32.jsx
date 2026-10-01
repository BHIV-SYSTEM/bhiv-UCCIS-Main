import React, { useEffect, useState } from "react";
import SidebarTask32 from "./SidebarTask32";
import IncidentChartTask32 from "./IncidentChartTask32";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from "recharts";


/* =========================================================
   TASK 32 — AIS FILE INTEGRATION
   Reads public/AIS_file.csv and derives the dashboard
   values directly from AIS telemetry.
   ========================================================= */

const AIS_FILE = "/AIS_file.csv";

const parseCSVLine = (line) => {
  const values = [];
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
      values.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  values.push(current.trim());
  return values;
};

const parseAISCSV = (text) => {
  const lines = String(text || "")
    .replace(/^\uFEFF/, "")
    .split(/\r?\n/)
    .filter((line) => line.trim());

  if (lines.length < 2) return [];

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
  const keys = Object.keys(row || {});
  const wanted = names.map((name) => String(name).toLowerCase());

  const matchedKey = keys.find((key) =>
    wanted.includes(String(key).trim().toLowerCase())
  );

  return matchedKey ? row[matchedKey] : "";
};

const toNumber = (value) => {
  const number = Number.parseFloat(value);
  return Number.isFinite(number) ? number : null;
};

const normalizeAISRow = (row, index) => {
  const mmsi = String(
    getAISField(row, ["MMSI", "mmsi", "Mmsi", "vessel_id"]) || ""
  ).trim();

  const lat = toNumber(
    getAISField(row, ["LAT", "lat", "Latitude", "latitude"])
  );

  const lon = toNumber(
    getAISField(row, ["LON", "lon", "Longitude", "longitude"])
  );

  const sog = toNumber(
    getAISField(row, ["SOG", "sog", "Speed", "speed", "Speed Over Ground"])
  );

  const timestamp = String(
    getAISField(row, [
      "BaseDateTime",
      "baseDateTime",
      "Timestamp",
      "timestamp",
      "DateTime",
      "datetime",
    ]) || ""
  ).trim();

  const vesselType = String(
    getAISField(row, [
      "VesselType",
      "vesselType",
      "Vessel Type",
      "vessel_type",
      "ShipType",
      "ship_type",
    ]) || ""
  ).trim();

  return {
    id: index + 1,
    mmsi: mmsi || `UNKNOWN-${index + 1}`,
    lat,
    lon,
    sog,
    timestamp,
    vesselType,
    validCoordinates:
      lat !== null &&
      lon !== null &&
      lat >= -90 &&
      lat <= 90 &&
      lon >= -180 &&
      lon <= 180,
    validSpeed: sog !== null && sog >= 0,
    moving: sog !== null && sog > 0,
    stationary: sog !== null && sog === 0,
  };
};

const buildAISMetrics = (records) => {
  const total = records.length;

  const validTelemetry = records.filter(
    (record) => record.validCoordinates && record.validSpeed
  ).length;

  const moving = records.filter((record) => record.moving).length;
  const stationary = records.filter((record) => record.stationary).length;

  const invalid = records.filter(
    (record) => !record.validCoordinates || !record.validSpeed
  ).length;

  const vessels = new Set(
    records.map((record) => record.mmsi).filter(Boolean)
  ).size;

  const movingVessels = new Set(
    records
      .filter((record) => record.moving)
      .map((record) => record.mmsi)
      .filter(Boolean)
  ).size;

  const speeds = records
    .map((record) => record.sog)
    .filter((value) => value !== null);

  const averageSpeed = speeds.length
    ? speeds.reduce((sum, value) => sum + value, 0) / speeds.length
    : 0;

  const quality = total
    ? Math.round((validTelemetry / total) * 100)
    : 0;

  const latestTimestamp = records
    .map((record) => record.timestamp)
    .filter(Boolean)
    .sort((a, b) => {
      const ta = Date.parse(a);
      const tb = Date.parse(b);
      return (Number.isFinite(tb) ? tb : 0) - (Number.isFinite(ta) ? ta : 0);
    })[0] || "";

  return {
    total,
    validTelemetry,
    moving,
    stationary,
    invalid,
    vessels,
    movingVessels,
    averageSpeed,
    quality,
    latestTimestamp,
  };
};

/* =========================================================
   TASK 32 — RUNTIME DASHBOARD
   FIXED VERSION

   Why this version is different:
   1. It does NOT stay on Loading... when the backend is unavailable.
   2. It uses Task 32's actual backend prefix:
      /api/v2/task32/dashboard
   3. It falls back to safe demo data if the dashboard API fails.
   4. Execute Signal uses:
      /api/v2/task32/runtime/execute-signal
   ========================================================= */

const buildDashboardFromAIS = (records) => {
  const metrics = buildAISMetrics(records);

  const validMoving = records.filter(
    (record) => record.validCoordinates && record.validSpeed && record.moving
  ).length;

  const validStationary = records.filter(
    (record) => record.validCoordinates && record.validSpeed && record.stationary
  ).length;

  const latestRecords = [...records]
    .sort((a, b) => {
      const ta = Date.parse(a.timestamp || "");
      const tb = Date.parse(b.timestamp || "");
      return (Number.isFinite(tb) ? tb : 0) - (Number.isFinite(ta) ? ta : 0);
    })
    .slice(0, 8);

  return {
    cards: {
      signals: metrics.total,
      telemetry: metrics.validTelemetry,
      incidents: validStationary,
      escalations: metrics.invalid,
      runtimeHealth:
        metrics.total > 0 && metrics.quality >= 95
          ? "ONLINE"
          : metrics.total > 0
          ? "DEGRADED"
          : "OFFLINE",
      replaySessions: metrics.vessels,
    },

    analytics: {
      signals: metrics.total,
      incidents: validStationary,
      escalations: metrics.invalid,

      // These are mutually exclusive AIS activity percentages.
      cpu: metrics.total
        ? Math.round((validMoving / metrics.total) * 100)
        : 0,
      memory: metrics.total
        ? Math.round((validStationary / metrics.total) * 100)
        : 0,
      network: metrics.total
        ? Math.round((metrics.invalid / metrics.total) * 100)
        : 0,
      disk: metrics.total
        ? Math.max(
            0,
            100 -
              Math.round((validMoving / metrics.total) * 100) -
              Math.round((validStationary / metrics.total) * 100) -
              Math.round((metrics.invalid / metrics.total) * 100)
          )
        : 0,

      latency: metrics.averageSpeed,
      errorRate: metrics.total
        ? `${((metrics.invalid / metrics.total) * 100).toFixed(2)}%`
        : "0%",
    },

    summary: {
      dataQuality: `${metrics.quality}%`,
      totalRecords: metrics.total,
      uniqueVessels: metrics.vessels,
      averageSOG: metrics.averageSpeed,
      latestTimestamp: metrics.latestTimestamp || "N/A",
    },

    logs: latestRecords.map((record) => ({
      timestamp: record.timestamp || "N/A",
      module: "AIS Telemetry",
      status: !record.validCoordinates || !record.validSpeed
        ? "VALIDATION ERROR"
        : record.moving
        ? "MOVING"
        : "STATIONARY",
      mmsi: record.mmsi,
    })),
  };
};

const AISActivityChartTask32 = ({
  total = 0,
  moving = 0,
  stationary = 0,
  invalid = 0,
}) => {
  const data = [
    {
      name: "AIS Records",
      value: total,
      label: "Total AIS Records",
      fill: "#2563eb",
    },
    {
      name: "Moving",
      value: moving,
      label: "Moving AIS Records",
      fill: "#16a34a",
    },
    {
      name: "Stationary",
      value: stationary,
      label: "Stationary AIS Records",
      fill: "#f59e0b",
    },
    {
      name: "Invalid",
      value: invalid,
      label: "Invalid AIS Records",
      fill: "#dc2626",
    },
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload.length) return null;

    const item = payload[0].payload;

    return (
      <div
        style={{
          background: "#0f172a",
          border: "1px solid #334155",
          borderRadius: 8,
          padding: "10px 12px",
          color: "#ffffff",
          boxShadow: "0 6px 18px rgba(0,0,0,0.18)",
        }}
      >
        <div style={{ fontWeight: 700, marginBottom: 4 }}>
          {item.label}
        </div>
        <div>
          Count: {Number(item.value || 0).toLocaleString()}
        </div>
      </div>
    );
  };

  return (
    <div style={{ width: "100%", height: 360 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 25,
            left: 20,
            bottom: 45,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            label={{
              value: "AIS Activity Type",
              position: "insideBottom",
              offset: -28,
            }}
          />
          <YAxis
            allowDecimals={false}
            label={{
              value: "AIS Record Count",
              angle: -90,
              position: "insideLeft",
              offset: 0,
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="value" name="AIS Records" radius={[5, 5, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`ais-cell-${index}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

const RuntimeDashboardTask32 = () => {
  const [activePanel, setActivePanel] = useState("dashboard");
  const [loading, setLoading] = useState(false);

  const [aisRecords, setAisRecords] = useState([]);
  const [aisLoading, setAisLoading] = useState(true);
  const [aisError, setAisError] = useState("");

  const loadAIS = async () => {
    setLoading(true);
    setAisLoading(true);
    setAisError("");

    try {
      const response = await fetch(`${AIS_FILE}?t=${Date.now()}`, {
        method: "GET",
        cache: "no-store",
        headers: {
          Accept: "text/csv,*/*",
        },
      });

      if (!response.ok) {
        throw new Error(`AIS_file.csv returned HTTP ${response.status}`);
      }

      const csvText = await response.text();

      if (!csvText.trim()) {
        throw new Error("AIS_file.csv returned an empty response.");
      }

      const parsed = parseAISCSV(csvText);
      const normalized = parsed
        .map(normalizeAISRow)
        .filter((record) => record.mmsi || record.timestamp);

      setAisRecords(normalized);

      if (!normalized.length) {
        setAisError("AIS_file.csv loaded but contains no valid data rows.");
      }
    } catch (error) {
      console.error("Task 32 AIS Error:", error);
      setAisRecords([]);
      setAisError(error.message || "Unable to load AIS_file.csv.");
    } finally {
      setAisLoading(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAIS();

    const interval = window.setInterval(loadAIS, 30000);

    return () => window.clearInterval(interval);
  }, []);

  const aisMetrics = React.useMemo(
    () => buildAISMetrics(aisRecords),
    [aisRecords]
  );

  const dashboard = React.useMemo(
    () => buildDashboardFromAIS(aisRecords),
    [aisRecords]
  );

  const cards = dashboard.cards || {};
  const analytics = dashboard.analytics || {};
  const logs = Array.isArray(dashboard.logs) ? dashboard.logs : [];

  const displayCards = cards;
  const displayAnalytics = analytics;

  const cpu = Number(displayAnalytics.cpu ?? 0);
  const memory = Number(displayAnalytics.memory ?? 0);
  const network = Number(displayAnalytics.network ?? 0);
  const disk = Number(displayAnalytics.disk ?? 0);

  return (
    <div className="task32-fixed-root">
      <style>{`
        .task32-fixed-root {
          display: flex;
          width: 100%;
          min-height: 700px;
          background: #f5f7fb;
          color: #172033;
          border-radius: 14px;
          overflow: hidden;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system,
            BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        .task32-fixed-main {
          flex: 1;
          min-width: 0;
          padding: 26px;
          overflow-x: hidden;
        }

        .task32-fixed-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 20px;
        }

        .task32-fixed-header h1 {
          margin: 0;
          font-size: 26px;
          color: #173b63;
        }

        .task32-fixed-header p {
          margin: 5px 0 0;
          color: #64748b;
          font-size: 13px;
        }

        .task32-execute {
          border: 0;
          border-radius: 8px;
          padding: 11px 17px;
          background: #2563eb;
          color: #fff;
          cursor: pointer;
          font-weight: 700;
        }

        .task32-execute:hover {
          background: #1d4ed8;
        }

        .task32-refresh {
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          padding: 10px 14px;
          background: #fff;
          color: #334155;
          cursor: pointer;
          font-weight: 600;
        }

        .task32-actions {
          display: flex;
          gap: 8px;
          align-items: center;
          flex-wrap: wrap;
          justify-content: flex-end;
        }

        .task32-status {
          margin-bottom: 16px;
          padding: 10px 13px;
          border-radius: 8px;
          background: #fff7ed;
          border: 1px solid #fed7aa;
          color: #9a3412;
          font-size: 12px;
        }

        .task32-success {
          margin-bottom: 16px;
          padding: 10px 13px;
          border-radius: 8px;
          background: #ecfdf5;
          border: 1px solid #a7f3d0;
          color: #047857;
          font-size: 12px;
        }

        .task32-entry {
          padding: 18px;
          margin-bottom: 18px;
          border-radius: 12px;
          background: #fff;
          border: 1px solid #e2e8f0;
          cursor: pointer;
          box-shadow: 0 3px 10px rgba(15, 23, 42, 0.05);
        }

        .task32-entry:hover {
          border-color: #93c5fd;
        }

        .task32-entry h3 {
          margin: 0;
          color: #173b63;
        }

        .task32-entry p {
          margin: 6px 0 0;
          color: #64748b;
          font-size: 13px;
        }

        .task32-cards {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 14px;
          margin-bottom: 18px;
        }

        .task32-card {
          padding: 18px;
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          box-shadow: 0 3px 10px rgba(15, 23, 42, 0.05);
        }

        .task32-card-label {
          color: #64748b;
          font-size: 12px;
          font-weight: 700;
        }

        .task32-card-value {
          margin-top: 8px;
          color: #173b63;
          font-size: 28px;
          font-weight: 800;
        }

        .task32-panel {
          padding: 20px;
          margin-bottom: 18px;
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          box-shadow: 0 3px 10px rgba(15, 23, 42, 0.05);
        }

        .task32-panel h2,
        .task32-panel h3 {
          margin-top: 0;
          color: #173b63;
        }

        .task32-health-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 14px;
        }

        .task32-health {
          padding: 18px;
          border-radius: 10px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
        }

        .task32-health strong {
          display: block;
          margin-top: 7px;
          font-size: 22px;
        }

        .task32-online {
          color: #15803d;
        }

        .task32-pie-wrap {
          display: flex;
          align-items: center;
          gap: 28px;
          flex-wrap: wrap;
        }

        .task32-pie {
          width: 220px;
          height: 220px;
          border-radius: 50%;
          background: conic-gradient(
            #ff4d4f 0 ${cpu}%,
            #1890ff ${cpu}% ${cpu + memory}%,
            #52c41a ${cpu + memory}% ${cpu + memory + network}%,
            #faad14 ${cpu + memory + network}% 100%
          );
          position: relative;
        }

        .task32-pie::after {
          content: "AIS ACTIVITY";
          position: absolute;
          inset: 43px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          background: #fff;
          color: #64748b;
          font-size: 11px;
          font-weight: 800;
        }

        .task32-legend p {
          margin: 8px 0;
          font-size: 13px;
        }

        .task32-table {
          width: 100%;
          border-collapse: collapse;
        }

        .task32-table th,
        .task32-table td {
          padding: 11px;
          text-align: left;
          border-bottom: 1px solid #e2e8f0;
          font-size: 12px;
        }

        .task32-table th {
          color: #64748b;
          background: #f8fafc;
        }

        .task32-json {
          max-height: 320px;
          overflow: auto;
          padding: 14px;
          border-radius: 8px;
          background: #0f172a;
          color: #dbeafe;
          font-size: 11px;
        }

        @media (max-width: 1000px) {
          .task32-cards {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .task32-health-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 650px) {
          .task32-fixed-main {
            padding: 16px;
          }

          .task32-fixed-header {
            align-items: flex-start;
            flex-direction: column;
          }

          .task32-cards {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <SidebarTask32
        activePanel={activePanel}
        setActivePanel={setActivePanel}
      />

      <main className="task32-fixed-main">
        <header className="task32-fixed-header">
          <div>
            <h1>
              {activePanel === "dashboard" && "Dashboard Runtime State"}
              {activePanel === "signals" && "Signal Layer Analytics"}
              {activePanel === "runtime" && "System Runtime Health"}
              {activePanel === "replay" && "Replay View"}
              {activePanel === "logs" && "Runtime Logs"}
            </h1>
            {/* <p>Task 32 · AIS Runtime Dashboard</p> */}
          </div>

          <div className="task32-actions">
            <button
              className="task32-refresh"
              type="button"
              onClick={loadAIS}
              disabled={loading}
            >
              {loading ? "Refreshing..." : "↻ Refresh"}
            </button>

            {/* <button
              className="task32-execute"
              type="button"
              onClick={handleExecuteSignal}
            >
              Execute Signal
            </button> */}
          </div>
        </header>

        {/* <div
          className="task32-status"
          style={{
            background: aisError ? "#fef2f2" : "#ecfdf5",
            borderColor: aisError ? "#fecaca" : "#a7f3d0",
            color: aisError ? "#991b1b" : "#047857",
          }}
        >
          {aisLoading
            ? "Loading AIS_file.csv..."
            : aisError
            ? aisError
            : `AIS_file.csv connected • ${aisMetrics.total.toLocaleString()} records • ${aisMetrics.vessels.toLocaleString()} unique vessels • ${aisMetrics.quality}% valid telemetry`}
        </div> */}

        {activePanel === "dashboard" && (
          <>
            <div
              className="task32-entry"
              onClick={() => setActivePanel("runtime")}
            >
              <h3>System Runtime Health</h3>
              <p>Click to open complete runtime analytics</p>
            </div>

            <div className="task32-cards">
              <div className="task32-card">
                <div className="task32-card-label">AIS RECORDS</div>
                <div className="task32-card-value">{displayCards.signals}</div>
              </div>
              <div className="task32-card">
                <div className="task32-card-label">VALID TELEMETRY</div>
                <div className="task32-card-value">{displayCards.telemetry}</div>
              </div>
              <div className="task32-card">
                <div className="task32-card-label">STATIONARY RECORDS</div>
                <div className="task32-card-value">{displayCards.incidents}</div>
              </div>
              <div className="task32-card">
                <div className="task32-card-label">INVALID TELEMETRY</div>
                <div className="task32-card-value">{displayCards.escalations}</div>
              </div>
            </div>

            <div className="task32-panel">
              <h3>AIS Activity Overview</h3>
              <AISActivityChartTask32
                total={aisMetrics.total}
                moving={aisMetrics.moving}
                stationary={aisMetrics.stationary}
                invalid={aisMetrics.invalid}
              />
            </div>
          </>
        )}

        {activePanel === "signals" && (
          <section className="task32-panel">
            <h2>AIS Signal Layer - Deep Analytics</h2>
            <div className="task32-cards">
              <div className="task32-card">
                <div className="task32-card-label">AIS RECORDS</div>
                <div className="task32-card-value">{displayCards.signals}</div>
              </div>
              <div className="task32-card">
                <div className="task32-card-label">VALID TELEMETRY</div>
                <div className="task32-card-value">{displayCards.telemetry}</div>
              </div>
              <div className="task32-card">
                <div className="task32-card-label">STATIONARY RECORDS</div>
                <div className="task32-card-value">{displayCards.incidents}</div>
              </div>
              <div className="task32-card">
                <div className="task32-card-label">INVALID TELEMETRY</div>
                <div className="task32-card-value">{displayCards.escalations}</div>
              </div>
            </div>

            <AISActivityChartTask32
              total={aisMetrics.total}
              moving={aisMetrics.moving}
              stationary={aisMetrics.stationary}
              invalid={aisMetrics.invalid}
            />

            <div className="task32-health-grid" style={{ marginTop: 18 }}>
              <div className="task32-health">
                Unique Vessels
                <strong>{aisMetrics.vessels.toLocaleString()}</strong>
              </div>
              <div className="task32-health">
                Moving Vessels
                <strong>{aisMetrics.movingVessels.toLocaleString()}</strong>
              </div>
              <div className="task32-health">
                Average SOG
                <strong>{aisMetrics.averageSpeed.toFixed(4)}</strong>
              </div>
            </div>

            {/* <h3>Backend Response</h3>
            <pre className="task32-json">
              {JSON.stringify(dashboard, null, 2)}
            </pre> */}
          </section>
        )}

        {activePanel === "runtime" && (
          <section className="task32-panel">
            <h2>System Runtime Health - Full Analytics</h2>

            <div className="task32-health-grid">
              <div className="task32-health">
                Runtime Status
                <strong className="task32-online">
                  {displayCards.runtimeHealth || "ONLINE"}
                </strong>
              </div>
              <div className="task32-health">
                Moving AIS Records
                <strong>{aisMetrics.moving.toLocaleString()}</strong>
              </div>
              <div className="task32-health">
                Valid Telemetry
                <strong>{aisMetrics.validTelemetry.toLocaleString()}</strong>
              </div>
              <div className="task32-health">
                Average SOG
                <strong>{aisMetrics.averageSpeed.toFixed(4)}</strong>
              </div>
              <div className="task32-health">
                Validation Error Rate
                <strong>{displayAnalytics.errorRate ?? "0%"}</strong>
              </div>
              <div className="task32-health">
                AIS Data Quality
                <strong>{dashboard.summary?.dataQuality || "0%"}</strong>
              </div>
            </div>

            <div style={{ marginTop: 20 }}>
              <h3>Runtime Performance Trend</h3>
              <AISActivityChartTask32
                total={aisMetrics.total}
                moving={aisMetrics.moving}
                stationary={aisMetrics.stationary}
                invalid={aisMetrics.invalid}
              />
            </div>

            <div style={{ marginTop: 20 }}>
              <h3>AIS Activity Distribution</h3>
              <div className="task32-pie-wrap">
                <div className="task32-pie" />
                <div className="task32-legend">
                  <p>🔴 Moving: {displayAnalytics.cpu}%</p>
                  <p>🔵 Stationary: {displayAnalytics.memory}%</p>
                  <p>🟢 Invalid: {displayAnalytics.network}%</p>
                  <p>🟡 Other Valid: {displayAnalytics.disk}%</p>
                </div>
              </div>
            </div>

            {/* <div style={{ marginTop: 20 }}>
              <h3>AIS Runtime Data</h3>
              <pre className="task32-json">
                {JSON.stringify(dashboard, null, 2)}
              </pre>
            </div> */}
          </section>
        )}

        {activePanel === "replay" && (
          <section className="task32-panel">
            <h2>Replay View</h2>
            <div className="task32-cards">
              <div className="task32-card">
                <div className="task32-card-label">REPLAY SESSIONS</div>
                <div className="task32-card-value">
                  {displayCards.replaySessions || 0}
                </div>
              </div>
              <div className="task32-card">
                <div className="task32-card-label">AIS RECORDS</div>
                <div className="task32-card-value">{displayCards.signals}</div>
              </div>
              <div className="task32-card">
                <div className="task32-card-label">STATIONARY RECORDS</div>
                <div className="task32-card-value">{displayCards.incidents}</div>
              </div>
              <div className="task32-card">
                <div className="task32-card-label">INVALID TELEMETRY</div>
                <div className="task32-card-value">{displayCards.escalations}</div>
              </div>
            </div>

            <h3>AIS Replay Summary</h3>
            <div className="task32-health-grid">
              <div className="task32-health">
                Total AIS Records
                <strong>{aisMetrics.total.toLocaleString()}</strong>
              </div>
              <div className="task32-health">
                Unique Vessels
                <strong>{aisMetrics.vessels.toLocaleString()}</strong>
              </div>
              <div className="task32-health">
                Moving Records
                <strong>{aisMetrics.moving.toLocaleString()}</strong>
              </div>
            </div>
          </section>
        )}

        {activePanel === "logs" && (
          <section className="task32-panel">
            <h2>Runtime Logs</h2>
            <table className="task32-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Module</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {logs.length > 0 ? (
                  logs.map((log, index) => (
                    <tr key={`${log.timestamp || "log"}-${index}`}>
                      <td>{log.timestamp || "-"}</td>
                      <td>{log.module || "-"}{log.mmsi ? ` • MMSI ${log.mmsi}` : ""}</td>
                      <td>{log.status || "-"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3">No Runtime Logs Available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </section>
        )}
      </main>
    </div>
  );
};

export default RuntimeDashboardTask32;
