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
  Activity,
  AlertTriangle,
  ShieldAlert,
  Cpu,
  TrafficCone,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import "./TrafficSimulation.css";

/*
=========================================================
TRAFFIC SIMULATION RUNTIME
=========================================================
*/

const TrafficSimulation = () => {
  const navigate = useNavigate();

  /*
  =========================================================
  TRAFFIC FLOW DATA
  =========================================================
  */

  const trafficFlowData = [
    {
      zone: "Shivajinagar",
      congestion: 78,
    },

    {
      zone: "Baner",
      congestion: 65,
    },

    {
      zone: "Kothrud",
      congestion: 84,
    },

    {
      zone: "Hadapsar",
      congestion: 92,
    },

    {
      zone: "Hinjewadi",
      congestion: 74,
    },

    {
      zone: "Pimpri",
      congestion: 88,
    },

    {
      zone: "Wakad",
      congestion: 63,
    },
  ];

  /*
  =========================================================
  TRAFFIC DENSITY DATA
  =========================================================
  */

  const trafficDensityData = [
    {
      name: "Moderate",
      value: 34,
    },

    {
      name: "Heavy",
      value: 48,
    },

    {
      name: "Critical",
      value: 18,
    },
  ];

  /*
  =========================================================
  ESCALATION DATA
  =========================================================
  */

  const escalationData = [
    {
      area: "Swargate",
      escalations: 12,
    },

    {
      area: "Yerwada",
      escalations: 19,
    },

    {
      area: "Baner",
      escalations: 9,
    },

    {
      area: "Kharadi",
      escalations: 16,
    },

    {
      area: "Pimpri",
      escalations: 22,
    },

    {
      area: "Wakad",
      escalations: 14,
    },
  ];

  /*
  =========================================================
  LOGS
  =========================================================
  */

  const logs = [
    "[RUNTIME] Traffic congestion threshold exceeded at Swargate.",
    "[SIGNAL] Smart traffic telemetry degraded in Yerwada.",
    "[ESCALATION] Emergency mobility reroute initiated.",
    "[RUNTIME] Vehicle density crossed operational limit.",
    "[REPLAY] Traffic replay reconstruction stored.",
    "[MDU] Traffic governance dataset synchronized.",
    "[TTG] Congestion simulation chain executed successfully.",
  ];

  /*
  =========================================================
  UI
  =========================================================
  */

  return (
    <div className="traffic-page">
      {/* =================================================
      HEADER
      ================================================= */}

      <header className="traffic-header">
        <div className="traffic-header-left">
          <div className="traffic-icon">
            <TrafficCone size={34} />
          </div>

          <div>
            <h1>
              Traffic Congestion Runtime
            </h1>

            <p>
              TTG Operational Mobility
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

      <section className="traffic-overview-grid">
        {/* ============================================
        TRAFFIC SIGNALS
        ============================================ */}

        <div className="overview-card">
          <div className="overview-icon">
            <Activity size={28} />
          </div>

          <h2>284</h2>

          <p>Traffic Signals</p>
        </div>

        {/* ============================================
        CRITICAL CONGESTION
        ============================================ */}

        <div className="overview-card">
          <div className="overview-icon">
            <AlertTriangle size={28} />
          </div>

          <h2>31</h2>

          <p>Critical Congestion</p>
        </div>

        {/* ============================================
        OPERATIONAL HEALTH
        ============================================ */}

        <div className="overview-card">
          <div className="overview-icon">
            <ShieldAlert size={28} />
          </div>

          <h2>86%</h2>

          <p>Operational Health</p>
        </div>

        {/* ============================================
        TRAFFIC DENSITY
        ============================================ */}

        <div className="overview-card">
          <div className="overview-icon">
            <Cpu size={28} />
          </div>

          <h2>74%</h2>

          <p>Traffic Density</p>
        </div>
      </section>

      {/* =================================================
      CHARTS
      ================================================= */}

      <section className="traffic-chart-grid">
        {/* ============================================
        TRAFFIC FLOW
        ============================================ */}

        <div className="chart-card">
          <h3>
            Traffic Flow Analysis
          </h3>

          <ResponsiveContainer
            width="100%"
            height={320}
          >
            <LineChart
              data={trafficFlowData}
            >
              <CartesianGrid
                strokeDasharray="3 3"
              />

              <XAxis dataKey="zone" />

              <YAxis />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="congestion"
                stroke="#f97316"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* ============================================
        TRAFFIC DENSITY
        ============================================ */}

        <div className="chart-card">
          <h3>
            Traffic Density Status
          </h3>

          <ResponsiveContainer
            width="100%"
            height={320}
          >
            <PieChart>
              <Pie
                data={trafficDensityData}
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
            Congestion Escalation Trend
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
                fill="#dc2626"
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
          Traffic Runtime Information
        </h2>

        <p>
          This TTG traffic simulation
          environment models real-time
          urban congestion escalation
          behavior across multiple
          Pune operational districts.
        </p>

        <p>
          Runtime telemetry signals are
          continuously monitored for:
        </p>

        <div className="info-grid">
          <div className="info-box">
            <h4>
              Congestion Detection
            </h4>

            <p>
              AI-assisted congestion
              monitoring and anomaly
              detection.
            </p>
          </div>

          <div className="info-box">
            <h4>
              Escalation Runtime
            </h4>

            <p>
              Real-time escalation
              routing for critical
              traffic overload events.
            </p>
          </div>

          <div className="info-box">
            <h4>
              Replay Reconstruction
            </h4>

            <p>
              Event sourcing and replay
              visibility for mobility
              incident reconstruction.
            </p>
          </div>

          <div className="info-box">
            <h4>
              Operational Telemetry
            </h4>

            <p>
              Runtime telemetry chain
              synchronization with MDU
              governance structure.
            </p>
          </div>
        </div>
      </section>

      {/* =================================================
      RUNTIME LOGS
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

export default TrafficSimulation;