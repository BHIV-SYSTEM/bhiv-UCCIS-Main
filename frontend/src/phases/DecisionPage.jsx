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

function DecisionPage() {

  const decisionTrend = [
    { day: "Mon", decisions: 8 },
    { day: "Tue", decisions: 12 },
    { day: "Wed", decisions: 10 },
    { day: "Thu", decisions: 16 },
    { day: "Fri", decisions: 14 },
    { day: "Sat", decisions: 9 },
    { day: "Sun", decisions: 7 }
  ];

  const decisionTypes = [
    { name: "Approved", value: 55 },
    { name: "Pending", value: 25 },
    { name: "Rejected", value: 20 }
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
          <h2>148</h2>
          <p>Total Decisions</p>
        </div>

        <div className="metric-card">
          <h2>82</h2>
          <p>Approved</p>
        </div>

        <div className="metric-card">
          <h2>37</h2>
          <p>Pending</p>
        </div>

        <div className="metric-card">
          <h2>29</h2>
          <p>Rejected</p>
        </div>

      </div>

      {/* TREND GRAPH */}

      <div className="chart-card">

        <h2>📈 Decision Trend</h2>

        <ResponsiveContainer width="100%" height={350}>

          <BarChart data={decisionTrend}>

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
    value: "Decision Count",
    angle: -90,
    position: "insideLeft",
  }}
/>

            <Tooltip />

            <Bar
              dataKey="decisions"
              fill="#3B82F6"
              radius={[8,8,0,0]}
            />

          </BarChart>

        </ResponsiveContainer>

      </div>

      {/* PIE CHART */}

      <div className="chart-card">

        <h2>📊 Decision Distribution</h2>

        <ResponsiveContainer width="100%" height={350}>

          <PieChart>

            <Pie
              data={decisionTypes}
              dataKey="value"
              outerRadius={120}
              label
            >

              {decisionTypes.map((entry,index)=>(
                <Cell
                  key={index}
                  fill={COLORS[index]}
                />
              ))}

            </Pie>

            <Tooltip />

          </PieChart>

        </ResponsiveContainer>

      </div>

      {/* BACKEND RESPONSE */}

      <div className="chart-card">

        <h2>🗄 Decision Backend Response</h2>

        <table className="runtime-table" style={{ color: "#000000"}}>

          <thead>
            <tr>
              <th>ID</th>
              <th>Decision</th>
              <th>Status</th>
              <th>Authority</th>
            </tr>
          </thead>

          <tbody>

            <tr>
              <td style={{ color: "#000000"}}>DEC-101</td>
              <td style={{ color: "#000000"}}>Waste Cleanup</td>
              <td style={{ color: "#000000"}}>Approved</td>
              <td style={{ color: "#000000"}}>Commissioner</td>
            </tr>

            <tr>
              <td style={{ color: "#000000"}}>DEC-102</td>
              <td style={{ color: "#000000"}}>Water Repair</td>
              <td style={{ color: "#000000"}}>Pending</td>
              <td style={{ color: "#000000"}}>Department Head</td>
            </tr>

            <tr>
              <td style={{ color: "#000000"}}>DEC-103</td>
              <td style={{ color: "#000000"}}>Traffic Diversion</td>
              <td style={{ color: "#000000"}}>Rejected</td>
              <td style={{ color: "#000000"}}>Supervisor</td>
            </tr>

          </tbody>

        </table>

      </div>

      {/* APPROVAL WORKFLOW */}

      <div className="chart-card">

        <h2>✅ Approval Workflow</h2>

        <table className="runtime-table" style={{ color: "#000000"}}>

          <thead>
            <tr>
              <th>Request</th>
              <th>Submitted By</th>
              <th>Current Stage</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>

            <tr>
              <td style={{ color: "#000000"}}>Waste Overflow</td>
              <td style={{ color: "#000000"}}>Operator A</td>
              <td style={{ color: "#000000"}}>Supervisor</td>
              <td style={{ color: "#000000"}}>Pending</td>
            </tr>

            <tr>
              <td style={{ color: "#000000"}}>Water Leakage</td>
              <td style={{ color: "#000000"}}>Operator B</td>
              <td style={{ color: "#000000"}}>Department Head</td>
              <td style={{ color: "#000000"}}>Review</td>
            </tr>

            <tr>
              <td style={{ color: "#000000"}}>Traffic Signal Repair</td>
              <td style={{ color: "#000000"}}>Operator C</td>
              <td style={{ color: "#000000"}}>Commissioner</td>
              <td style={{ color: "#000000"}}>Approved</td>
            </tr>

          </tbody>

        </table>

      </div>

      {/* DECISION TIMELINE */}

      <div className="chart-card">

        <h2>🕒 Decision Timeline</h2>

        <div className="timeline">

          <div className="timeline-item">
            <div className="timeline-dot"></div>
            <div className="timeline-content">
              09:00 - Decision Request Submitted
            </div>
          </div>

          <div className="timeline-item">
            <div className="timeline-dot"></div>
            <div className="timeline-content">
              09:20 - Supervisor Review
            </div>
          </div>

          <div className="timeline-item">
            <div className="timeline-dot"></div>
            <div className="timeline-content">
              09:45 - Approval Granted
            </div>
          </div>

          <div className="timeline-item">
            <div className="timeline-dot"></div>
            <div className="timeline-content">
              10:00 - Decision Executed
            </div>
          </div>

        </div>

      </div>

      {/* ENGINE STATUS */}

      {/* <div className="chart-card">

        <h2>⚙ Decision Engine Status</h2>

        <div className="card-grid">

          <div className="metric-card">
            <h2>ONLINE</h2>
            <p>Decision Engine</p>
          </div>

          <div className="metric-card">
            <h2>CONNECTED</h2>
            <p>Master DB</p>
          </div>

          <div className="metric-card">
            <h2>ACTIVE</h2>
            <p>Approval Service</p>
          </div>

          <div className="metric-card">
            <h2>97%</h2>
            <p>Decision Accuracy</p>
          </div>

        </div>

      </div> */}

    </div>
  );
}

export default DecisionPage;