import React from "react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts";

function RuntimeLogsPage() {

  const logTrend = [
    { hour: "09", logs: 120 },
    { hour: "10", logs: 180 },
    { hour: "11", logs: 150 },
    { hour: "12", logs: 210 },
    { hour: "13", logs: 240 },
    { hour: "14", logs: 170 }
  ];

  const severityData = [
    { name: "Info", value: 60 },
    { name: "Warning", value: 25 },
    { name: "Error", value: 15 }
  ];

  const COLORS = [
    "#22C55E",
    "#EAB308",
    "#EF4444"
  ];

  return (
    <div>

      {/* KPI CARDS */}

      <div className="card-grid">

        <div className="metric-card">
          <h2>2,451</h2>
          <p>Total Logs</p>
        </div>

        <div className="metric-card">
          <h2>312</h2>
          <p>Warnings</p>
        </div>

        <div className="metric-card">
          <h2>97</h2>
          <p>Errors</p>
        </div>

        <div className="metric-card">
          <h2>99.8%</h2>
          <p>System Uptime</p>
        </div>

      </div>

      {/* LOG TREND */}

      <div className="chart-card">

        <h2>📈 Runtime Log Activity</h2>

        <ResponsiveContainer
          width="100%"
          height={350}
        >

          <BarChart data={logTrend}>

            <CartesianGrid stroke="#334155" />

            <XAxis
  dataKey="hour"
  label={{
    value: "Hour",
    position: "insideBottom",
    offset: -5,
  }}
/>

<YAxis
  label={{
    value: "Log Count",
    angle: -90,
    position: "insideLeft",
  }}
/>

            <Tooltip />

            <Bar
              dataKey="logs"
              fill="#06B6D4"
              radius={[8,8,0,0]}
            />

          </BarChart>

        </ResponsiveContainer>

      </div>

      {/* SEVERITY PIE */}

      <div className="chart-card">

        <h2>📊 Log Severity Distribution</h2>

        <ResponsiveContainer
          width="100%"
          height={350}
        >

          <PieChart>

            <Pie
              data={severityData}
              dataKey="value"
              outerRadius={120}
              label
            >

              {severityData.map(
                (entry,index)=>(
                  <Cell
                    key={index}
                    fill={COLORS[index]}
                  />
                )
              )}

            </Pie>

            <Tooltip />

          </PieChart>

        </ResponsiveContainer>

      </div>

      {/* BACKEND RESPONSE */}

      <div className="chart-card">

        <h2>🗄 Runtime Backend Response</h2>

        <table className="runtime-table" style={{ color: "#000000"}}>

          <thead>
            <tr>
              <th>Service</th>
              <th>Status</th>
              <th>Last Update</th>
            </tr>
          </thead>

          <tbody>

            <tr>
              <td style={{ color: "#000000"}}>Telemetry Service</td>
              <td style={{ color: "#000000"}}>Running</td>
              <td style={{ color: "#000000"}}>14:02:12</td>
            </tr>

            <tr>
              <td style={{ color: "#000000"}}>Replay Engine</td>
              <td style={{ color: "#000000"}}>Running</td>
              <td style={{ color: "#000000"}}>14:02:05</td>
            </tr>

            <tr>
              <td style={{ color: "#000000"}}>Analytics Engine</td>
              <td style={{ color: "#000000"}}>Running</td>
              <td style={{ color: "#000000"}}>14:01:55</td>
            </tr>

          </tbody>

        </table>

      </div>

      {/* RECENT LOGS */}

      <div className="chart-card">

        <h2>📜 Recent Runtime Logs</h2>

        <table className="runtime-table" style={{ color: "#000000"}}>

          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Module</th>
              <th>Message</th>
            </tr>
          </thead>

          <tbody>

            <tr>
              <td style={{ color: "#000000"}}>14:00:01</td>
              <td style={{ color: "#000000"}}>Telemetry</td>
              <td style={{ color: "#000000"}}>Signal received successfully</td>
            </tr>

            <tr>
              <td style={{ color: "#000000"}}>14:00:08</td>
              <td style={{ color: "#000000"}}>Incident</td>
              <td style={{ color: "#000000"}}>Incident created</td>
            </tr>

            <tr>
              <td style={{ color: "#000000"}}>14:00:15</td>
              <td style={{ color: "#000000"}}>Replay</td>
              <td style={{ color: "#000000"}}>Replay session started</td>
            </tr>

            <tr>
              <td style={{ color: "#000000"}}>14:00:20</td>
              <td style={{ color: "#000000"}}>Analytics</td>
              <td style={{ color: "#000000"}}>Insight generated</td>
            </tr>

          </tbody>

        </table>

      </div>

      {/* ERROR EVENTS */}

      <div className="chart-card">

        <h2>⚠ Error Events</h2>

        <table className="runtime-table" style={{ color: "#000000"}}>

          <thead>
            <tr>
              <th>Error ID</th>
              <th>Module</th>
              <th>Description</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>

            <tr>
              <td style={{ color: "#000000"}}>ERR-001</td>
              <td style={{ color: "#000000"}}>Replay</td>
              <td style={{ color: "#000000"}}>Session timeout</td>
              <td style={{ color: "#000000"}}>Resolved</td>
            </tr>

            <tr>
              <td style={{ color: "#000000"}}>ERR-002</td>
              <td style={{ color: "#000000"}}>Telemetry</td>
              <td style={{ color: "#000000"}}>Signal delay detected</td>
              <td style={{ color: "#000000"}}>Monitoring</td>
            </tr>

            <tr>
              <td style={{ color: "#000000"}}>ERR-003</td>
              <td style={{ color: "#000000"}}>Analytics</td>
              <td style={{ color: "#000000"}}>Processing retry</td>
              <td style={{ color: "#000000"}}>Resolved</td>
            </tr>

          </tbody>

        </table>

      </div>

      {/* TIMELINE */}

      <div className="chart-card">

        <h2>🕒 Runtime Timeline</h2>

        <div className="timeline">

          <div className="timeline-item">
            <div className="timeline-dot"></div>
            <div className="timeline-content">
              13:55 - System Started
            </div>
          </div>

          <div className="timeline-item">
            <div className="timeline-dot"></div>
            <div className="timeline-content">
              14:00 - Telemetry Event Received
            </div>
          </div>

          <div className="timeline-item">
            <div className="timeline-dot"></div>
            <div className="timeline-content">
              14:01 - Replay Triggered
            </div>
          </div>

          <div className="timeline-item">
            <div className="timeline-dot"></div>
            <div className="timeline-content">
              14:02 - Analytics Updated
            </div>
          </div>

        </div>

      </div>

      {/* ENGINE STATUS */}

      {/* <div className="chart-card">

        <h2>⚙ Runtime Engine Status</h2>

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
            <p>Log Collector</p>
          </div>

          <div className="metric-card">
            <h2>99.8%</h2>
            <p>Availability</p>
          </div>

        </div>

      </div> */}

    </div>
  );
}

export default RuntimeLogsPage;