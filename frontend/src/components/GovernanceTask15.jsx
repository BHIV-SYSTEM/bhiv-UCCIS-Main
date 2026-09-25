import React, { useEffect, useState } from "react";

import {
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
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

import "./GovernanceTask15.css";

/* =====================================================
   SEED DATA
===================================================== */

const REPLAY_LINEAGE_DATA = [
  { stage: "Signal", value: 22 },
  { stage: "Escalation", value: 18 },
  { stage: "Recovery", value: 14 },
  { stage: "Validation", value: 30 },
];

const AUDIT_TREND_SEED = [
  { time: "10:00", value: 10 },
  { time: "10:05", value: 14 },
  { time: "10:10", value: 22 },
  { time: "10:15", value: 15 },
  { time: "10:20", value: 24 },
  { time: "10:25", value: 32 },
];

const GOVERNANCE_PIE_DATA = [
  { name: "Verified", value: 85 },
  { name: "Flagged", value: 15 },
];

const GOVERNANCE_COLORS = ["#00e08f", "#ff4d4f"];

const VALIDATION_EVENTS = [
  "> Replay lineage verified",
  "> Governance reconstruction validated",
  "> Audit continuity active",
  "> Append-only persistence confirmed",
  "> Anti-misrepresentation active",
];

const GOVERNANCE_METRICS = [
  {
    label: "Replay Safety",
    value: "PASS",
  },
  {
    label: "Lineage Integrity",
    value: "VERIFIED",
  },
  {
    label: "Divergence Visibility",
    value: "ACTIVE",
  },
  {
    label: "Audit Continuity",
    value: "ENABLED",
  },
];

/* =====================================================
   MAIN COMPONENT
===================================================== */

const GovernanceTask15 = () => {
  const [auditTrend, setAuditTrend] = useState(AUDIT_TREND_SEED);
  const [timestamp, setTimestamp] = useState(
    new Date().toISOString()
  );

  /* =====================================================
     LIVE AUDIT SIMULATION
  ===================================================== */

  useEffect(() => {
    const interval = setInterval(() => {
      setAuditTrend((previous) => {
        if (!previous || previous.length === 0) {
          return AUDIT_TREND_SEED;
        }

        const next = previous.slice(1);

        const lastTime =
          previous[previous.length - 1]?.time || "10:25";

        const [hours, minutes] = lastTime
          .split(":")
          .map(Number);

        const totalMinutes = hours * 60 + minutes + 5;

        const newTime = `${String(
          Math.floor(totalMinutes / 60) % 24
        ).padStart(2, "0")}:${String(
          totalMinutes % 60
        ).padStart(2, "0")}`;

        next.push({
          time: newTime,
          value: Math.floor(8 + Math.random() * 28),
        });

        return next;
      });

      setTimestamp(new Date().toISOString());
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  /* =====================================================
     BACKEND GOVERNANCE RESPONSE
  ===================================================== */

  const backendResponse = {
    platform: "UCCIS",
    governanceSafe: true,
    lineageIntegrity: "VERIFIED",
    auditContinuity: "ACTIVE",
    replaySafe: true,
    divergenceRisk: "LOW",
    activeAudits: 184,
    timestamp,
  };

  return (
    <div className="gcc-dashboard">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="gcc-header">
        <div>
          {/* <div className="gcc-eyebrow">
            UCCIS · TASK 15
          </div> */}

          <h1>Governance Command Center</h1>

          <p>
            Replay-safe operational governance visibility
          </p>
        </div>

        {/* <div className="gcc-live-status">
          <span className="gcc-live-dot" />
          GOVERNANCE ACTIVE
        </div> */}
      </header>

      {/* =================================================
          STAT CARDS
      ================================================= */}

      <section className="gcc-stat-grid">

        <div className="gcc-stat-card gcc-stat-success">
          <span className="gcc-stat-label">
            Governance Integrity
          </span>

          <span className="gcc-stat-value verified">
            VERIFIED
          </span>
        </div>

        <div className="gcc-stat-card gcc-stat-primary">
          <span className="gcc-stat-label">
            Replay Lineage
          </span>

          <span className="gcc-stat-value">
            98%
          </span>
        </div>

        <div className="gcc-stat-card gcc-stat-info">
          <span className="gcc-stat-label">
            Active Audits
          </span>

          <span className="gcc-stat-value">
            184
          </span>
        </div>

        <div className="gcc-stat-card gcc-stat-success">
          <span className="gcc-stat-label">
            Divergence Risk
          </span>

          <span className="gcc-stat-value low">
            LOW
          </span>
        </div>

      </section>

      {/* =================================================
          ROW 1
      ================================================= */}

      <section className="gcc-row gcc-row-3">

        {/* GOVERNANCE STATUS */}

        <div className="gcc-panel">

          <div className="gcc-panel-header">
            <div>
              <h3>Governance Status</h3>

              <p>
                Current governance validation state
              </p>
            </div>

            <span className="gcc-panel-badge success">
              ACTIVE
            </span>
          </div>

          <div className="gcc-chart gcc-pie-chart">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <PieChart>

                <Pie
                  data={GOVERNANCE_PIE_DATA}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="43%"
                  outerRadius={82}
                  innerRadius={48}
                  paddingAngle={3}
                  labelLine={false}
                  label={({ percent }) =>
                    `${(percent * 100).toFixed(0)}%`
                  }
                >
                  {GOVERNANCE_PIE_DATA.map(
                    (entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={
                          GOVERNANCE_COLORS[index]
                        }
                      />
                    )
                  )}
                </Pie>

                <Tooltip
                  contentStyle={{
                    background: "#101923",
                    border:
                      "1px solid #263545",
                    borderRadius: "8px",
                    color: "#ffffff",
                  }}
                />

                <Legend
                  verticalAlign="bottom"
                  align="center"
                  iconType="circle"
                  wrapperStyle={{
                    color: "#d6dde5",
                    fontSize: "11px",
                    paddingTop: "10px",
                  }}
                />

              </PieChart>
            </ResponsiveContainer>

          </div>

        </div>

        {/* REPLAY LINEAGE */}

        <div className="gcc-panel">

          <div className="gcc-panel-header">
            <div>
              <h3>
                Replay Lineage Validation
              </h3>

              <p>
                Validation events across replay stages
              </p>
            </div>

            <span className="gcc-panel-badge success">
              VERIFIED
            </span>
          </div>

          <div className="gcc-chart">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <BarChart
                data={REPLAY_LINEAGE_DATA}
                margin={{
                  top: 15,
                  right: 20,
                  left: 5,
                  bottom: 50,
                }}
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#1e2733"
                  vertical={false}
                />

                <XAxis
                  dataKey="stage"
                  stroke="#6b7785"
                  tick={{
                    fontSize: 11,
                    fill: "#9aa8b8",
                  }}
                  tickMargin={8}
                  label={{
                    value:
                      "Replay Lineage Stages",
                    position: "insideBottom",
                    offset: -32,
                    fill: "#d6dde5",
                    fontSize: 11,
                  }}
                />

                <YAxis
                  stroke="#6b7785"
                  tick={{
                    fontSize: 10,
                    fill: "#9aa8b8",
                  }}
                  width={45}
                  label={{
                    value: "Validation Count",
                    angle: -90,
                    position: "insideLeft",
                    offset: 10,
                    fill: "#d6dde5",
                    fontSize: 11,
                  }}
                />

                <Tooltip
                  contentStyle={{
                    background: "#101923",
                    border:
                      "1px solid #263545",
                    borderRadius: "8px",
                    color: "#ffffff",
                  }}
                />

                <Bar
                  dataKey="value"
                  name="Validation Count"
                  fill="#00e08f"
                  radius={[4, 4, 0, 0]}
                  barSize={38}
                />

              </BarChart>
            </ResponsiveContainer>

          </div>

        </div>

        {/* AUDIT TREND */}

        <div className="gcc-panel">

          <div className="gcc-panel-header">
            <div>
              <h3>
                Audit Continuity Trend
              </h3>

              <p>
                Continuous audit event activity
              </p>
            </div>

            <span className="gcc-panel-badge success">
              LIVE
            </span>
          </div>

          <div className="gcc-chart">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <LineChart
                data={auditTrend}
                margin={{
                  top: 15,
                  right: 20,
                  left: 5,
                  bottom: 50,
                }}
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#1e2733"
                  vertical={false}
                />

                <XAxis
                  dataKey="time"
                  stroke="#6b7785"
                  tick={{
                    fontSize: 10,
                    fill: "#9aa8b8",
                  }}
                  tickMargin={8}
                  label={{
                    value: "Audit Timeline",
                    position: "insideBottom",
                    offset: -32,
                    fill: "#d6dde5",
                    fontSize: 11,
                  }}
                />

                <YAxis
                  stroke="#6b7785"
                  tick={{
                    fontSize: 10,
                    fill: "#9aa8b8",
                  }}
                  width={45}
                  label={{
                    value: "Audit Events",
                    angle: -90,
                    position: "insideLeft",
                    offset: 10,
                    fill: "#d6dde5",
                    fontSize: 11,
                  }}
                />

                <Tooltip
                  contentStyle={{
                    background: "#101923",
                    border:
                      "1px solid #263545",
                    borderRadius: "8px",
                    color: "#ffffff",
                  }}
                />

                <Line
                  type="monotone"
                  dataKey="value"
                  name="Audit Events"
                  stroke="#00e08f"
                  strokeWidth={2.5}
                  dot={{
                    r: 3,
                    fill: "#00e08f",
                    stroke: "#00e08f",
                  }}
                  activeDot={{
                    r: 5,
                  }}
                />

              </LineChart>
            </ResponsiveContainer>

          </div>

        </div>

      </section>

      {/* =================================================
          ROW 2
      ================================================= */}

      <section className="gcc-row gcc-row-2">

        {/* VALIDATION EVENTS */}

        <div className="gcc-panel">

          <div className="gcc-panel-header">
            <div>
              <h3>
                Governance Validation Events
              </h3>

              <p>
                Active governance verification stream
              </p>
            </div>

            <span className="gcc-panel-badge success">
              5 ACTIVE
            </span>
          </div>

          <div className="gcc-log">

            {VALIDATION_EVENTS.map(
              (line, index) => (
                <div
                  key={line}
                  className="gcc-log-line"
                >
                  <span className="gcc-log-index">
                    {String(index + 1).padStart(
                      2,
                      "0"
                    )}
                  </span>

                  <span className="gcc-log-dot" />

                  <span>{line}</span>
                </div>
              )
            )}

          </div>

        </div>

        {/* GOVERNANCE METRICS */}

        <div className="gcc-panel">

          <div className="gcc-panel-header">
            <div>
              <h3>Governance Metrics</h3>

              <p>
                Platform governance control state
              </p>
            </div>

            <span className="gcc-panel-badge success">
              HEALTHY
            </span>
          </div>

          <div className="gcc-metrics">

            {GOVERNANCE_METRICS.map(
              (metric) => (
                <div
                  key={metric.label}
                  className="gcc-metric-line"
                >
                  <span className="gcc-metric-label">
                    {metric.label}
                  </span>

                  <span className="gcc-metric-value">
                    <span className="gcc-metric-dot" />
                    {metric.value}
                  </span>
                </div>
              )
            )}

          </div>

        </div>

      </section>

      {/* =================================================
          FOOTER
      ================================================= */}

      <div className="gcc-footer">

        <span>
          UCCIS Governance Command Center
        </span>

        <span>
          Last synchronization:{" "}
          {new Date(timestamp).toLocaleTimeString()}
        </span>

      </div>

    </div>
  );
};

export default GovernanceTask15;