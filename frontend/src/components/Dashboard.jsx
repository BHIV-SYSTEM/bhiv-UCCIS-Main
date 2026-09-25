import React, { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import {
  Circle,
  Database,
  Activity,
  AlertTriangle,
  Link2,
  Settings,
} from "lucide-react";

import "../styles/Task15.css";

/* =====================================================
   SIDEBAR NAV ITEMS
===================================================== */

const SECTIONS = [
  { id: "governance", label: "Governance", icon: Circle },
  { id: "replay", label: "Replay", icon: Database },
  { id: "telemetry", label: "Telemetry", icon: Activity },
  { id: "validation", label: "Validation", icon: AlertTriangle },
  { id: "operators", label: "Operators", icon: Link2 },
  { id: "testing", label: "Testing", icon: Settings },
];

/* =====================================================
   STATIC / SEED DATA
   (swap these for real API data whenever ready)
===================================================== */

const TELEMETRY_SEED = [
  { time: "10:00", value: 78 },
  { time: "10:05", value: 42 },
  { time: "10:10", value: 55 },
  { time: "10:15", value: 88 },
  { time: "10:20", value: 66 },
  { time: "10:25", value: 82 },
  { time: "10:30", value: 70 },
];

const REPLAY_RECON_DATA = [
  { stage: "Detected", value: 18 },
  { stage: "Isolated", value: 10 },
  { stage: "Recovered", value: 24 },
  { stage: "Validated", value: 32 },
];

const CORRUPTION_RECOVERY_DATA = [
  { stage: "Detected", value: 17 },
  { stage: "Isolated", value: 9 },
  { stage: "Recovered", value: 26 },
  { stage: "Validated", value: 34 },
];

const GOVERNANCE_PIE_DATA = [
  { name: "Verified", value: 88 },
  { name: "Flagged", value: 12 },
];

const GOVERNANCE_COLORS = ["#00e08f", "#ff4d4f"];

const RECOVERY_LOG = [
  "> Corruption detected",
  "> Replay isolated",
  "> Recovery initiated",
  "> Replay continuity verified",
];

/* =====================================================
   MAIN COMPONENT
===================================================== */

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState("governance");
  const [telemetryData, setTelemetryData] = useState(TELEMETRY_SEED);
  const [timestamp, setTimestamp] = useState(new Date().toISOString());

  /* =====================================================
     SIMULATE LIVE DATA
     Refreshes the telemetry chart + timestamp on an
     interval so the panel feels "live". Replace this
     with a WebSocket / polling call to your real backend.
  ===================================================== */

  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetryData((prev) => {
        const next = prev.slice(1);
        const lastTime = prev[prev.length - 1].time;
        const [h, m] = lastTime.split(":").map(Number);
        const totalMinutes = h * 60 + m + 5;
        const newTime = `${String(
          Math.floor(totalMinutes / 60) % 24
        ).padStart(2, "0")}:${String(totalMinutes % 60).padStart(2, "0")}`;

        next.push({
          time: newTime,
          value: Math.floor(30 + Math.random() * 65),
        });

        return next;
      });

      setTimestamp(new Date().toISOString());
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const backendResponse = {
    platform: "UCCIS",
    status: "FINAL OPERATIONAL GOVERNANCE PLATFORM ACTIVE",
    replaySafe: true,
    governanceSafe: true,
    telemetryStreaming: true,
    timestamp,
  };

  return (
    <div className="task15-dashboard">
      {/* =================================================
          HEADER
      ================================================= */}

      <div className="task15-header">
        <div>
          <h1>UCCIS Operational Command Center</h1>
          <p>Replay-Safe Governance Infrastructure</p>
        </div>

        <div className="task15-live-badge">
          <span className="task15-live-dot" />
          LIVE
        </div>
      </div>

      {/* =================================================
          STATUS BAR
      ================================================= */}

      <div className="task15-status-bar">
        LIVE REPLAY ACTIVE &nbsp;•&nbsp; VALIDATION PASS &nbsp;•&nbsp;
        RECOVERY STABLE &nbsp;•&nbsp; GOVERNANCE VERIFIED
      </div>

      <div className="task15-body">
        {/* ===============================================
            SIDEBAR
        =============================================== */}

        <aside className="task15-sidebar">
          {SECTIONS.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                type="button"
                className={
                  activeSection === section.id
                    ? "task15-sidebar-btn active"
                    : "task15-sidebar-btn"
                }
                onClick={() => setActiveSection(section.id)}
              >
                <Icon size={16} />
                <span>{section.label}</span>
              </button>
            );
          })}
        </aside>

        {/* ===============================================
            MAIN CONTENT
        =============================================== */}

        <div className="task15-content">
          {/* ===========================================
              STAT CARDS
          =========================================== */}

          <div className="task15-stat-grid">
            <div className="task15-stat-card">
              <span className="task15-stat-label">Replay Confidence</span>
              <span className="task15-stat-value">98%</span>
            </div>

            <div className="task15-stat-card">
              <span className="task15-stat-label">Active Signals</span>
              <span className="task15-stat-value">184</span>
            </div>

            <div className="task15-stat-card">
              <span className="task15-stat-label">Operators</span>
              <span className="task15-stat-value">12</span>
            </div>

            <div className="task15-stat-card">
              <span className="task15-stat-label">Recovery Status</span>
              <span className="task15-stat-value stable">STABLE</span>
            </div>
          </div>

          {/* ===========================================
              ROW 1: TELEMETRY / REPLAY RECON / GOVERNANCE
          =========================================== */}

          <div className="task15-row task15-row-3">
            <div className="task15-panel">
              <h3>LIVE TELEMETRY</h3>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={telemetryData}>
                  <defs>
                    <linearGradient
                      id="telemetryFill"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="#00e08f"
                        stopOpacity={0.6}
                      />
                      <stop
                        offset="95%"
                        stopColor="#00e08f"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#1e2733"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="time"
                    stroke="#6b7785"
                    tick={{ fontSize: 11 }}
                  />
                  <YAxis stroke="#6b7785" tick={{ fontSize: 11 }} />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#00e08f"
                    strokeWidth={2}
                    fill="url(#telemetryFill)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="task15-panel">
              <h3>REPLAY RECONSTRUCTION</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={REPLAY_RECON_DATA}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#1e2733"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="stage"
                    stroke="#6b7785"
                    tick={{ fontSize: 11 }}
                  />
                  <YAxis stroke="#6b7785" tick={{ fontSize: 11 }} />
                  <Bar dataKey="value" fill="#00e08f" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="task15-panel">
              <h3>GOVERNANCE STATUS</h3>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={GOVERNANCE_PIE_DATA}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={0}
                    outerRadius={80}
                  >
                    {GOVERNANCE_PIE_DATA.map((entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={GOVERNANCE_COLORS[index]}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ===========================================
              ROW 2: BACKEND RESPONSE / CORRUPTION RECOVERY
          =========================================== */}

          <div className="task15-row task15-row-2">
            <div className="task15-panel">
              <h3>BACKEND OPERATIONAL RESPONSE</h3>
              <pre className="task15-json-block">
                {JSON.stringify(backendResponse, null, 2)}
              </pre>
            </div>

            <div className="task15-panel">
              <h3>CORRUPTION RECOVERY</h3>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={CORRUPTION_RECOVERY_DATA}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#1e2733"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="stage"
                    stroke="#6b7785"
                    tick={{ fontSize: 11 }}
                  />
                  <YAxis stroke="#6b7785" tick={{ fontSize: 11 }} />
                  <Bar dataKey="value" fill="#00e08f" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>

              <div className="task15-log">
                {RECOVERY_LOG.map((line) => (
                  <div key={line} className="task15-log-line">
                    {line}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;