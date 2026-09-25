import React from "react";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";

import {
  Trash2,
  AlertTriangle,
  ShieldAlert,
  Cpu,
  Activity,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import "./WasteSimulation.css";

/*
=========================================================
WASTE OVERFLOW RUNTIME
=========================================================
*/

const WasteSimulation = () => {
  const navigate = useNavigate();

  /*
  =========================================================
  WASTE COLLECTION DATA
  =========================================================
  */

  const wasteCollectionData = [
    {
      zone: "Kothrud",
      overflow: 62,
    },

    {
      zone: "Baner",
      overflow: 74,
    },

    {
      zone: "Hadapsar",
      overflow: 91,
    },

    {
      zone: "Pimpri",
      overflow: 82,
    },

    {
      zone: "Wakad",
      overflow: 69,
    },

    {
      zone: "Yerwada",
      overflow: 95,
    },

    {
      zone: "Kharadi",
      overflow: 77,
    },
  ];

  /*
  =========================================================
  WASTE STATUS DATA
  =========================================================
  */

  const wasteStatusData = [
    {
      name: "Operational",
      value: 58,
    },

    {
      name: "Overflow Risk",
      value: 28,
    },

    {
      name: "Critical",
      value: 14,
    },
  ];

  /*
  =========================================================
  ESCALATION DATA
  =========================================================
  */

  const escalationData = [
    {
      area: "Baner",
      escalations: 8,
    },

    {
      area: "Hadapsar",
      escalations: 18,
    },

    {
      area: "Pimpri",
      escalations: 13,
    },

    {
      area: "Yerwada",
      escalations: 22,
    },

    {
      area: "Wakad",
      escalations: 11,
    },

    {
      area: "Kharadi",
      escalations: 16,
    },
  ];

  /*
  =========================================================
  RUNTIME LOGS
  =========================================================
  */

  const logs = [
    "[RUNTIME] Waste overflow threshold exceeded in Yerwada.",
    "[SIGNAL] Smart sanitation telemetry degraded.",
    "[ESCALATION] Emergency waste clearance activated.",
    "[RUNTIME] Overflow risk crossed operational limits.",
    "[REPLAY] Waste runtime reconstruction stored.",
    "[MDU] Waste governance dataset synchronized.",
    "[TTG] Waste overflow simulation executed successfully.",
  ];

  /*
  =========================================================
  UI
  =========================================================
  */

  return (
    <div className="waste-page">
      {/* =================================================
      HEADER
      ================================================= */}

      <header className="waste-header">
        <div className="waste-header-left">
          <div className="waste-icon">
            <Trash2 size={34} />
          </div>

          <div>
            <h1>
              Waste Overflow Runtime
            </h1>

            <p>
              TTG Smart Sanitation
              Simulation Environment
            </p>
          </div>
        </div>

        <button
          className="back-btn"
          onClick={() => navigate("/")}
        >
          Back To Dashboard
        </button>
      </header>

      {/* =================================================
      OVERVIEW CARDS
      ================================================= */}

      <section className="waste-overview-grid">
        <div className="overview-card">
          <div className="overview-icon">
            <Activity size={28} />
          </div>

          <h2>194</h2>

          <p>Waste Monitoring Units</p>
        </div>

        <div className="overview-card">
          <div className="overview-icon">
            <AlertTriangle size={28} />
          </div>

          <h2>27</h2>

          <p>Critical Overflow Alerts</p>
        </div>

        <div className="overview-card">
          <div className="overview-icon">
            <ShieldAlert size={28} />
          </div>

          <h2>82%</h2>

          <p>Operational Health</p>
        </div>

        <div className="overview-card">
          <div className="overview-icon">
            <Cpu size={28} />
          </div>

          <h2>69%</h2>

          <p>Overflow Density</p>
        </div>
      </section>

      {/* =================================================
      CHARTS
      ================================================= */}

      <section className="waste-chart-grid">
        {/* ============================================
        WASTE OVERFLOW TREND
        ============================================ */}

        <div className="chart-card">
          <h3>
            Waste Overflow Trend
          </h3>

          <ResponsiveContainer
            width="100%"
            height={320}
          >
            <LineChart
              data={wasteCollectionData}
            >
              <CartesianGrid
                strokeDasharray="3 3"
              />

              <XAxis dataKey="zone" />

              <YAxis />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="overflow"
                stroke="#22c55e"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* ============================================
        WASTE STATUS
        ============================================ */}

        <div className="chart-card">
          <h3>
            Waste Runtime Status
          </h3>

          <ResponsiveContainer
            width="100%"
            height={320}
          >
            <PieChart>
              <Pie
                data={wasteStatusData}
                cx="50%"
                cy="50%"
                outerRadius={110}
                dataKey="value"
              >
                <Cell fill="#22c55e" />

                <Cell fill="#f59e0b" />

                <Cell fill="#ef4444" />
              </Pie>

              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* ============================================
        ESCALATION GRAPH
        ============================================ */}

        <div className="chart-card">
          <h3>
            Overflow Escalation Trend
          </h3>

          <ResponsiveContainer
            width="100%"
            height={320}
          >
            <BarChart
              data={escalationData}
            >
              <CartesianGrid
                strokeDasharray="3 3"
              />

              <XAxis dataKey="area" />

              <YAxis />

              <Tooltip />

              <Bar
                dataKey="escalations"
                fill="#ef4444"
                radius={[10, 10, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* =================================================
      INFORMATION PANEL
      ================================================= */}

      <section className="info-panel">
        <h2>
          Waste Overflow Runtime Information
        </h2>

        <p>
          This TTG sanitation simulation
          models real-time waste overflow
          escalation scenarios across
          urban operational districts.
        </p>

        <p>
          Runtime telemetry monitors:
        </p>

        <div className="info-grid">
          <div className="info-box">
            <h4>
              Overflow Detection
            </h4>

            <p>
              Smart sanitation sensors
              monitor overflow density
              and collection failures.
            </p>
          </div>

          <div className="info-box">
            <h4>
              Escalation Runtime
            </h4>

            <p>
              Overflow escalation chains
              activate emergency waste
              response workflows.
            </p>
          </div>

          <div className="info-box">
            <h4>
              Replay Reconstruction
            </h4>

            <p>
              Event sourcing enables
              replay visibility and
              operational reconstruction.
            </p>
          </div>

          <div className="info-box">
            <h4>
              Governance Telemetry
            </h4>

            <p>
              Waste telemetry integrates
              with MDU governance and
              canonical operational data.
            </p>
          </div>
        </div>
      </section>

      {/* =================================================
      LOGS
      ================================================= */}

      <section className="logs-panel">
        <h2>
          Runtime Operational Logs
        </h2>

        {logs.map((log, index) => (
          <div
            key={index}
            className="log-line"
          >
            {log}
          </div>
        ))}
      </section>
    </div>
  );
};

export default WasteSimulation;