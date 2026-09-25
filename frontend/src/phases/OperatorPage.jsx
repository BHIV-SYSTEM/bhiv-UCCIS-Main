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

function OperatorPage() {

  const activityData = [
    { day: "Mon", tasks: 20 },
    { day: "Tue", tasks: 25 },
    { day: "Wed", tasks: 18 },
    { day: "Thu", tasks: 30 },
    { day: "Fri", tasks: 28 },
    { day: "Sat", tasks: 15 },
    { day: "Sun", tasks: 12 }
  ];

  const statusData = [
    { name: "Online", value: 60 },
    { name: "Busy", value: 25 },
    { name: "Offline", value: 15 }
  ];

  const COLORS = [
    "#22C55E",
    "#F97316",
    "#EF4444"
  ];

  return (
    <div>

      {/* KPI CARDS */}

      <div className="card-grid">

        <div className="metric-card">
          <h2>42</h2>
          <p>Total Operators</p>
        </div>

        <div className="metric-card">
          <h2>28</h2>
          <p>Online</p>
        </div>

        <div className="metric-card">
          <h2>9</h2>
          <p>Busy</p>
        </div>

        <div className="metric-card">
          <h2>5</h2>
          <p>Offline</p>
        </div>

      </div>

      {/* ACTIVITY GRAPH */}

      <div className="chart-card">

        <h2>👷 Operator Activity Trend</h2>

        <ResponsiveContainer width="100%" height={350}>

          <BarChart data={activityData}>

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
    value: "Task Count",
    angle: -90,
    position: "insideLeft",
  }}
/>

            <Tooltip />

            <Bar
              dataKey="tasks"
              fill="#06B6D4"
              radius={[8,8,0,0]}
            />

          </BarChart>

        </ResponsiveContainer>

      </div>

      {/* STATUS PIE */}

      <div className="chart-card">

        <h2>📊 Operator Status Distribution</h2>

        <ResponsiveContainer width="100%" height={350}>

          <PieChart>

            <Pie
              data={statusData}
              dataKey="value"
              outerRadius={120}
              label
            >

              {statusData.map((entry,index)=>(
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

        <h2>🗄 Operator Backend Response</h2>

        <table className="runtime-table" style={{ color: "#000000"}}>

          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Zone</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>

            <tr>
              <td style={{ color: "#000000"}}>OP-101</td>
              <td style={{ color: "#000000"}}>Rahul Sharma</td>
              <td style={{ color: "#000000"}}>Ward 1</td>
              <td style={{ color: "#000000"}}>Online</td>
            </tr>

            <tr>
              <td style={{ color: "#000000"}}>OP-102</td>
              <td style={{ color: "#000000"}}>Priya Patil</td>
              <td style={{ color: "#000000"}}>Ward 2</td>
              <td style={{ color: "#000000"}}>Busy</td>
            </tr>

            <tr>
              <td style={{ color: "#000000"}}>OP-103</td>
              <td style={{ color: "#000000"}}>Amit Joshi</td>
              <td style={{ color: "#000000"}}>Ward 3</td>
              <td style={{ color: "#000000"}}>Offline</td>
            </tr>

          </tbody>

        </table>

      </div>

      {/* ACTIVE OPERATORS */}

      <div className="chart-card">

        <h2>👥 Active Operators</h2>

        <table className="runtime-table" style={{ color: "#000000"}}>

          <thead>
            <tr>
              <th>Operator</th>
              <th>Location</th>
              <th>Current Task</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>

            <tr>
              <td style={{ color: "#000000"}}>Rahul Sharma</td>
              <td style={{ color: "#000000"}}>Ward 1</td>
              <td style={{ color: "#000000"}}>Waste Cleanup</td>
              <td style={{ color: "#000000"}}>Assigned</td>
            </tr>

            <tr>
              <td style={{ color: "#000000"}}>Priya Patil</td>
              <td style={{ color: "#000000"}}>Ward 2</td>
              <td style={{ color: "#000000"}}>Water Leakage</td>
              <td style={{ color: "#000000"}}>Working</td>
            </tr>

            <tr>
              <td style={{ color: "#000000"}}>Ajay Kumar</td>
              <td style={{ color: "#000000"}}>Ward 5</td>
              <td style={{ color: "#000000"}}>Traffic Monitoring</td>
              <td style={{ color: "#000000"}}>Active</td>
            </tr>

          </tbody>

        </table>

      </div>

      {/* TASK ASSIGNMENTS */}

      <div className="chart-card">

        <h2>📋 Task Assignments</h2>

        <table className="runtime-table" style={{ color: "#000000"}}>

          <thead>
            <tr>
              <th>Task ID</th>
              <th>Task</th>
              <th>Assigned To</th>
              <th>Priority</th>
            </tr>
          </thead>

          <tbody>

            <tr>
              <td style={{ color: "#000000"}}>TASK-001</td>
              <td style={{ color: "#000000"}}>Waste Overflow</td>
              <td style={{ color: "#000000"}}>Rahul Sharma</td>
              <td style={{ color: "#000000"}}>High</td>
            </tr>

            <tr>
              <td style={{ color: "#000000"}}>TASK-002</td>
              <td style={{ color: "#000000"}}>Water Leakage</td>
              <td style={{ color: "#000000"}}>Priya Patil</td>
              <td style={{ color: "#000000"}}>Critical</td>
            </tr>

            <tr>
              <td style={{ color: "#000000"}}>TASK-003</td>
              <td style={{ color: "#000000"}}>Street Light Repair</td>
              <td style={{ color: "#000000"}}>Ajay Kumar</td>
              <td style={{ color: "#000000"}}>Medium</td>
            </tr>

          </tbody>

        </table>

      </div>

      {/* TIMELINE */}

      <div className="chart-card">

        <h2>🕒 Operator Timeline</h2>

        <div className="timeline">

          <div className="timeline-item">
            <div className="timeline-dot"></div>
            <div className="timeline-content">
              09:00 - Operator Logged In
            </div>
          </div>

          <div className="timeline-item">
            <div className="timeline-dot"></div>
            <div className="timeline-content">
              09:20 - Task Assigned
            </div>
          </div>

          <div className="timeline-item">
            <div className="timeline-dot"></div>
            <div className="timeline-content">
              10:00 - Field Activity Started
            </div>
          </div>

          <div className="timeline-item">
            <div className="timeline-dot"></div>
            <div className="timeline-content">
              11:15 - Task Completed
            </div>
          </div>

        </div>

      </div>

      {/* SYSTEM STATUS */}

      {/* <div className="chart-card">

        <h2>⚙ Operator Service Status</h2>

        <div className="card-grid">

          <div className="metric-card">
            <h2>ONLINE</h2>
            <p>Operator Service</p>
          </div>

          <div className="metric-card">
            <h2>CONNECTED</h2>
            <p>Master DB</p>
          </div>

          <div className="metric-card">
            <h2>ACTIVE</h2>
            <p>Task Engine</p>
          </div>

          <div className="metric-card">
            <h2>99%</h2>
            <p>Availability</p>
          </div>

        </div>

      </div> */}

    </div>
  );
}

export default OperatorPage;