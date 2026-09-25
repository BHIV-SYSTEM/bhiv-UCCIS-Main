import React from "react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

import {
  Waves,
  AlertTriangle,
  Activity,
  ShieldAlert,
  ArrowLeft,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import "./FloodSimulation.css";

const FloodSimulation = () => {
  const navigate = useNavigate();

  /* =====================================================
  FLOOD TREND DATA
  ===================================================== */

  const floodTrendData = [
    {
      time: "06:00",
      escalations: 2,
    },

    {
      time: "08:00",
      escalations: 5,
    },

    {
      time: "10:00",
      escalations: 8,
    },

    {
      time: "12:00",
      escalations: 12,
    },

    {
      time: "14:00",
      escalations: 16,
    },

    {
      time: "16:00",
      escalations: 13,
    },

    {
      time: "18:00",
      escalations: 9,
    },

    {
      time: "20:00",
      escalations: 4,
    },
  ];

  /* =====================================================
  WATER LEVEL DATA
  ===================================================== */

  const waterLevelData = [
    {
      zone: "Pune Central",
      level: 78,
    },

    {
      zone: "Shivajinagar",
      level: 88,
    },

    {
      zone: "Kothrud",
      level: 65,
    },

    {
      zone: "Baner",
      level: 92,
    },

    {
      zone: "Hadapsar",
      level: 74,
    },

    {
      zone: "Wakad",
      level: 81,
    },
  ];

  /* =====================================================
  PIE DATA
  ===================================================== */

  const pieData = [
    {
      name: "Resolved",
      value: 62,
    },

    {
      name: "Pending",
      value: 21,
    },

    {
      name: "Critical",
      value: 17,
    },
  ];

  /* =====================================================
  RESPONSE TIME DATA
  ===================================================== */

  const responseTimeData = [
    {
      hour: "06",
      response: 14,
    },

    {
      hour: "08",
      response: 12,
    },

    {
      hour: "10",
      response: 9,
    },

    {
      hour: "12",
      response: 7,
    },

    {
      hour: "14",
      response: 6,
    },

    {
      hour: "16",
      response: 8,
    },

    {
      hour: "18",
      response: 11,
    },
  ];

  return (
    <div className="flood-page">
      {/* =====================================================
      HEADER
      ===================================================== */}

      <header className="flood-header">
        <div>
          <h1>Flood Simulation Runtime</h1>

          <p>
            TTG Operational Escalation
            Monitoring
          </p>
        </div>

        <button
          className="back-btn"
          onClick={() => navigate("/")}
        >
          <ArrowLeft size={18} />

          Back To Dashboard
        </button>
      </header>

      {/* =====================================================
      METRICS
      ===================================================== */}

      <section className="flood-metrics-grid">
        <div className="flood-metric-card">
          <Activity size={28} />

          <h2>128</h2>

          <p>Flood Signals</p>
        </div>

        <div className="flood-metric-card">
          <AlertTriangle size={28} />

          <h2>16</h2>

          <p>Critical Escalations</p>
        </div>

        <div className="flood-metric-card">
          <ShieldAlert size={28} />

          <h2>91%</h2>

          <p>Operational Health</p>
        </div>

        <div className="flood-metric-card">
          <Waves size={28} />

          <h2>74%</h2>

          <p>Water Saturation</p>
        </div>
      </section>

      {/* =====================================================
      CHART GRID
      ===================================================== */}

      <section className="simulation-grid-layout">
        {/* =====================================================
        FLOOD ESCALATION TREND
        ===================================================== */}

        <div className="simulation-chart-card large-card">
          <h2>Flood Escalation Trend</h2>

          <ResponsiveContainer
            width="100%"
            height={400}
          >
            <BarChart data={floodTrendData}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="time" />

              <YAxis />

              <Tooltip />

              <Bar
                dataKey="escalations"
                fill="#3b82f6"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* =====================================================
        WATER LEVEL OVERVIEW
        ===================================================== */}

        <div className="simulation-chart-card">
          <h2>District Water Levels</h2>

          <ResponsiveContainer
            width="100%"
            height={350}
          >
            <BarChart data={waterLevelData}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="zone" />

              <YAxis />

              <Tooltip />

              <Bar
                dataKey="level"
                fill="#06b6d4"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* =====================================================
        STATUS DISTRIBUTION
        ===================================================== */}

        <div className="simulation-chart-card">
          <h2>Escalation Status</h2>

          <ResponsiveContainer
            width="100%"
            height={350}
          >
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={110}
                dataKey="value"
              >
                <Cell fill="#22c55e" />

                <Cell fill="#facc15" />

                <Cell fill="#ef4444" />
              </Pie>

              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* =====================================================
        RESPONSE TIME
        ===================================================== */}

        <div className="simulation-chart-card large-card">
          <h2>
            Emergency Response Timeline
          </h2>

          <ResponsiveContainer
            width="100%"
            height={350}
          >
            <LineChart
              data={responseTimeData}
            >
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="hour" />

              <YAxis />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="response"
                stroke="#22c55e"
                strokeWidth={4}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* =====================================================
      INFORMATION PANEL
      ===================================================== */}

      <section className="simulation-info-panel">
        <h2>
          TTG Flood Runtime Information
        </h2>

        <div className="info-grid">
          <div className="info-card">
            <h3>Scenario Trigger</h3>

            <p>
              Continuous rainfall surge
              detected across Pune
              operational zones causing
              telemetry spikes and
              infrastructure degradation.
            </p>
          </div>

          <div className="info-card">
            <h3>Escalation Chain</h3>

            <p>
              Signal → Telemetry →
              Escalation → Runtime →
              Replay → Dashboard
              Reflection.
            </p>
          </div>

          <div className="info-card">
            <h3>Operational Impact</h3>

            <p>
              Water logging alerts,
              drainage overload,
              delayed emergency response
              and transport disruption.
            </p>
          </div>

          <div className="info-card">
            <h3>Replay Visibility</h3>

            <p>
              Replay engine captured all
              escalation chains and
              runtime reconstruction
              checkpoints.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FloodSimulation;