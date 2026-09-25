import React from "react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from "recharts";

function ReplayPage() {

  const replayTrend = [
    { day: "Mon", sessions: 4 },
    { day: "Tue", sessions: 7 },
    { day: "Wed", sessions: 5 },
    { day: "Thu", sessions: 8 },
    { day: "Fri", sessions: 10 },
    { day: "Sat", sessions: 6 },
    { day: "Sun", sessions: 4 }
  ];

  const replayStatus = [
    { name: "Completed", value: 65 },
    { name: "Running", value: 20 },
    { name: "Failed", value: 15 }
  ];

  const COLORS = [
    "#22C55E",
    "#3B82F6",
    "#EF4444"
  ];

  return (
    <div>

      {/* KPI CARDS */}

      <div className="card-grid">

        <div className="metric-card">
          <h2>48</h2>
          <p>Total Replays</p>
        </div>

        <div className="metric-card">
          <h2>31</h2>
          <p>Completed</p>
        </div>

        <div className="metric-card">
          <h2>10</h2>
          <p>Running</p>
        </div>

        <div className="metric-card">
          <h2>7</h2>
          <p>Failed</p>
        </div>

      </div>

      {/* REPLAY TREND */}

      <div className="chart-card">

        <h2>🔄 Replay Session Trend</h2>

        <ResponsiveContainer
          width="100%"
          height={350}
        >

          <BarChart data={replayTrend}>

            <CartesianGrid stroke="#334155" />

            <XAxis
  dataKey="day"
  label={{
    value: "Day",
    position: "insideBottom",
    offset: -5,
  }}
/>

<YAxis
  label={{
    value: "Replay Sessions",
    angle: -90,
    position: "insideLeft",
  }}
/>

            <Tooltip />

            <Bar
              dataKey="sessions"
              fill="#8B5CF6"
              radius={[8,8,0,0]}
            />

          </BarChart>

        </ResponsiveContainer>

      </div>

      {/* STATUS PIE */}

      <div className="chart-card">

        <h2>📊 Replay Status Distribution</h2>

        <ResponsiveContainer
          width="100%"
          height={350}
        >

          <PieChart>

            <Pie
              data={replayStatus}
              dataKey="value"
              outerRadius={120}
              label
            >

              {replayStatus.map(
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

        <h2>🗄 Replay Backend Response</h2>

        <table className="runtime-table" style={{ color: "#000000"}}>

          <thead>
            <tr>
              <th>Replay ID</th>
              <th>Incident</th>
              <th>Status</th>
              <th>Duration</th>
            </tr>
          </thead>

          <tbody>

            <tr>
              <td style={{ color: "#000000"}}>RP-101</td>
              <td style={{ color: "#000000"}}>Waste Overflow</td>
              <td style={{ color: "#000000"}}>Completed</td>
              <td style={{ color: "#000000"}}>5 min</td>
            </tr>

            <tr>
              <td style={{ color: "#000000"}}>RP-102</td>
              <td style={{ color: "#000000"}}>Traffic Jam</td>
              <td style={{ color: "#000000"}}>Running</td>
              <td style={{ color: "#000000"}}>2 min</td>
            </tr>

            <tr>
              <td style={{ color: "#000000"}}>RP-103</td>
              <td style={{ color: "#000000"}}>Water Leakage</td>
              <td style={{ color: "#000000"}}>Failed</td>
              <td style={{ color: "#000000"}}>1 min</td>
            </tr>

          </tbody>

        </table>

      </div>

      {/* REPLAY EVENTS */}

      <div className="chart-card">

        <h2>📜 Replay Runtime Events</h2>

        <table className="runtime-table" style={{ color: "#000000"}}>

          <thead>
            <tr>
              <th>Session</th>
              <th>Started</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>

            <tr>
              <td style={{ color: "#000000"}}>Replay-101</td>
              <td style={{ color: "#000000"}}>10:00</td>
              <td style={{ color: "#000000"}}>Completed</td>
            </tr>

            <tr>
              <td style={{ color: "#000000"}}>Replay-102</td>
              <td style={{ color: "#000000"}}>10:30</td>
              <td style={{ color: "#000000"}}>Completed</td>
            </tr>

            <tr>
              <td style={{ color: "#000000"}}>Replay-103</td>
              <td style={{ color: "#000000"}}>11:15</td>
              <td style={{ color: "#000000"}}>Running</td>
            </tr>

            <tr>
              <td style={{ color: "#000000"}}>Replay-104</td>
              <td style={{ color: "#000000"}}>11:45</td>
              <td style={{ color: "#000000"}}>Failed</td>
            </tr>

          </tbody>

        </table>

      </div>

      {/* TIMELINE */}

      <div className="chart-card">

        <h2>🕒 Replay Timeline</h2>

        <div className="timeline">

          <div className="timeline-item">
            <div className="timeline-dot"></div>
            <div className="timeline-content">
              10:00 - Replay Started
            </div>
          </div>

          <div className="timeline-item">
            <div className="timeline-dot"></div>
            <div className="timeline-content">
              10:02 - Signal Loaded
            </div>
          </div>

          <div className="timeline-item">
            <div className="timeline-dot"></div>
            <div className="timeline-content">
              10:04 - Incident Reconstructed
            </div>
          </div>

          <div className="timeline-item">
            <div className="timeline-dot"></div>
            <div className="timeline-content">
              10:05 - Replay Completed
            </div>
          </div>

        </div>

      </div>

      {/* ENGINE STATUS */}

      {/* <div className="chart-card">

        <h2>⚙ Replay Engine Status</h2>

        <div className="card-grid">

          <div className="metric-card">
            <h2>ONLINE</h2>
            <p>Replay Engine</p>
          </div>

          <div className="metric-card">
            <h2>CONNECTED</h2>
            <p>Database</p>
          </div>

          <div className="metric-card">
            <h2>ACTIVE</h2>
            <p>Runtime Logs</p>
          </div>

          <div className="metric-card">
            <h2>99%</h2>
            <p>Replay Accuracy</p>
          </div>

        </div>

      </div> */}

    </div>
  );
}

export default ReplayPage;