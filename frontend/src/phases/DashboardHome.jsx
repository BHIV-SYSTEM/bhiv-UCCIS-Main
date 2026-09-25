import React from "react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

function DashboardHome() {

  const weeklySignals = [
    { day: "Mon", count: 40 },
    { day: "Tue", count: 65 },
    { day: "Wed", count: 52 },
    { day: "Thu", count: 90 },
    { day: "Fri", count: 75 },
    { day: "Sat", count: 60 },
    { day: "Sun", count: 45 }
  ];

  const incidents = [
    {
      name: "Waste",
      value: 40
    },
    {
      name: "Traffic",
      value: 30
    },
    {
      name: "Water",
      value: 20
    },
    {
      name: "StreetLight",
      value: 10
    }
  ];

  const colors = [
    "#06B6D4",
    "#22C55E",
    "#F97316",
    "#EF4444"
  ];

  return (
    <div>

      <div className="card-grid">

        <div className="metric-card">
          <h2>128</h2>
          <p>Total Signals</p>
        </div>

        <div className="metric-card">
          <h2>32</h2>
          <p>Total Incidents</p>
        </div>

        <div className="metric-card">
          <h2>6</h2>
          <p>Escalations</p>
        </div>

        <div className="metric-card">
          <h2>8</h2>
          <p>Replay Sessions</p>
        </div>

        <div className="metric-card">
          <h2>12</h2>
          <p>Operators Online</p>
        </div>

        <div className="metric-card">
          <h2>98%</h2>
          <p>System Health</p>
        </div>

      </div>

      <div className="chart-card">

        <h2>📈 Weekly Signal Trend</h2>

        <ResponsiveContainer
          width="100%"
          height={350}
        >
          <BarChart data={weeklySignals}>
            <CartesianGrid stroke="#334155" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Bar
              dataKey="count"
              fill="#06B6D4"
              radius={[8,8,0,0]}
            />
          </BarChart>
        </ResponsiveContainer>

      </div>

      <div className="chart-card">

        <h2>🚨 Incident Categories</h2>

        <ResponsiveContainer
          width="100%"
          height={350}
        >
          <PieChart>

            <Pie
              data={incidents}
              dataKey="value"
              nameKey="name"
              outerRadius={120}
              label
            >
              {incidents.map(
                (entry,index)=>(
                  <Cell
                    key={index}
                    fill={colors[index]}
                  />
                )
              )}
            </Pie>

            <Tooltip />

          </PieChart>
        </ResponsiveContainer>

      </div>

      <div className="chart-card">

        <h2>⚡ Runtime Activity Feed</h2>

        <table className="runtime-table">

          <thead>
            <tr>
              <th>Time</th>
              <th>Activity</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>

            <tr>
              <td style={{ color: "#000000" }}>10:00</td>
              <td style={{ color: "#000000" }}>Signal Received</td>
              <td style={{ color: "#000000" }}>SUCCESS</td>
            </tr>

            <tr>
              <td style={{ color: "#000000" }}>10:05</td>
              <td style={{ color: "#000000" }}>Escalation Triggered</td>
              <td style={{ color: "#000000" }}>ACTIVE</td>
            </tr>

            <tr>
              <td style={{ color: "#000000" }}>10:10</td>
              <td style={{ color: "#000000" }}>Replay Created</td>
              <td style={{ color: "#000000" }}>SUCCESS</td>
            </tr>

            <tr>
              <td style={{ color: "#000000" }}>10:15</td>
              <td style={{ color: "#000000" }}>Dashboard Updated</td>
              <td style={{ color: "#000000" }}>SUCCESS</td>
            </tr>

          </tbody>

        </table>

      </div>

      <div className="chart-card">

        <h2>🖥 UCCIS Platform Status</h2>

        <div className="card-grid">

          <div className="metric-card">
            <h2>ONLINE</h2>
            <p>Backend</p>
          </div>

          <div className="metric-card">
            <h2>CONNECTED</h2>
            <p>Database</p>
          </div>

          <div className="metric-card">
            <h2>ACTIVE</h2>
            <p>Telemetry</p>
          </div>

          <div className="metric-card">
            <h2>READY</h2>
            <p>Replay Engine</p>
          </div>

        </div>

      </div>

    </div>
  );
}

export default DashboardHome;