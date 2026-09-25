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

function AnalyticsPage() {

  const analyticsTrend = [
    { month: "Jan", value: 45 },
    { month: "Feb", value: 62 },
    { month: "Mar", value: 58 },
    { month: "Apr", value: 80 },
    { month: "May", value: 74 },
    { month: "Jun", value: 91 }
  ];

  const analyticsDistribution = [
    { name: "Telemetry", value: 35 },
    { name: "Incidents", value: 25 },
    { name: "Escalations", value: 20 },
    { name: "Replay", value: 20 }
  ];

  const COLORS = [
    "#06B6D4",
    "#EF4444",
    "#F97316",
    "#8B5CF6"
  ];

  return (
    <div>

      {/* KPI CARDS */}

      <div className="card-grid">

        <div className="metric-card">
          <h2>1,248</h2>
          <p>Total Records</p>
        </div>

        <div className="metric-card">
          <h2>96%</h2>
          <p>Prediction Accuracy</p>
        </div>

        <div className="metric-card">
          <h2>87%</h2>
          <p>System Efficiency</p>
        </div>

        <div className="metric-card">
          <h2>24</h2>
          <p>Generated Insights</p>
        </div>

      </div>

      {/* ANALYTICS TREND */}

      <div className="chart-card">

        <h2>📈 Analytics Trend</h2>

        <ResponsiveContainer
          width="100%"
          height={350}
        >

          <BarChart data={analyticsTrend}>

            <CartesianGrid stroke="#334155" />

            <XAxis
  dataKey="month"
  label={{
    value: "Month",
    position: "insideBottom",
    offset: -5,
  }}
/>

<YAxis
  label={{
    value: "Analytics Value",
    angle: -90,
    position: "insideLeft",
  }}
/>

            <Tooltip />

            <Bar
              dataKey="value"
              fill="#06B6D4"
              radius={[8,8,0,0]}
            />

          </BarChart>

        </ResponsiveContainer>

      </div>

      {/* PIE CHART */}

      <div className="chart-card">

        <h2>📊 Analytics Distribution</h2>

        <ResponsiveContainer
          width="100%"
          height={350}
        >

          <PieChart>

            <Pie
              data={analyticsDistribution}
              dataKey="value"
              outerRadius={120}
              label
            >

              {analyticsDistribution.map(
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

        <h2>🗄 Analytics Backend Response</h2>

        <table className="runtime-table" style={{ color: "#000000"}}>

          <thead>
            <tr>
              <th>ID</th>
              <th>Module</th>
              <th>Records</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>

            <tr>
              <td style={{ color: "#000000"}}>ANA-101</td>
              <td style={{ color: "#000000"}}>Telemetry</td>
              <td style={{ color: "#000000"}}>420</td>
              <td style={{ color: "#000000"}}>Processed</td>
            </tr>

            <tr>
              <td style={{ color: "#000000"}}>ANA-102</td>
              <td style={{ color: "#000000"}}>Incidents</td>
              <td style={{ color: "#000000"}}>280</td>
              <td style={{ color: "#000000"}}>Processed</td>
            </tr>

            <tr>
              <td style={{ color: "#000000"}}>ANA-103</td>
              <td style={{ color: "#000000"}}>Replay</td>
              <td style={{ color: "#000000"}}>195</td>
              <td style={{ color: "#000000"}}>Processed</td>
            </tr>

          </tbody>

        </table>

      </div>

      {/* TOP INSIGHTS */}

      <div className="chart-card">

        <h2>💡 Top Insights</h2>

        <table className="runtime-table" style={{ color: "#000000"}}>

          <thead>
            <tr>
              <th>Insight</th>
              <th>Impact</th>
              <th>Confidence</th>
            </tr>
          </thead>

          <tbody>

            <tr>
              <td style={{ color: "#000000"}}>Waste incidents increased</td>
              <td style={{ color: "#000000"}}>High</td>
              <td style={{ color: "#000000"}}>95%</td>
            </tr>

            <tr>
              <td style={{ color: "#000000"}}>Traffic congestion hotspot detected</td>
              <td style={{ color: "#000000"}}>Medium</td>
              <td style={{ color: "#000000"}}>89%</td>
            </tr>

            <tr>
              <td style={{ color: "#000000"}}>Replay success rate improved</td>
              <td style={{ color: "#000000"}}>High</td>
              <td style={{ color: "#000000"}}>97%</td>
            </tr>

          </tbody>

        </table>

      </div>

      {/* PERFORMANCE METRICS */}

      <div className="chart-card">

        <h2>📋 Performance Metrics</h2>

        <table className="runtime-table" style={{ color: "#000000"}}>

          <thead>
            <tr>
              <th>Metric</th>
              <th>Current</th>
              <th>Target</th>
            </tr>
          </thead>

          <tbody>

            <tr>
              <td style={{ color: "#000000"}}>Response Time</td>
              <td style={{ color: "#000000"}}>1.2 sec</td>
              <td style={{ color: "#000000"}}>2 sec</td>
            </tr>

            <tr>
              <td style={{ color: "#000000"}}>Accuracy</td>
              <td style={{ color: "#000000"}}>96%</td>
              <td style={{ color: "#000000"}}>90%</td>
            </tr>

            <tr>
              <td style={{ color: "#000000"}}>Availability</td>
              <td style={{ color: "#000000"}}>99.8%</td>
              <td style={{ color: "#000000"}}>99%</td>
            </tr>

          </tbody>

        </table>

      </div>

      {/* TIMELINE */}

      <div className="chart-card">

        <h2>🕒 Analytics Timeline</h2>

        <div className="timeline">

          <div className="timeline-item">
            <div className="timeline-dot"></div>
            <div className="timeline-content">
              09:00 - Data Collection Started
            </div>
          </div>

          <div className="timeline-item">
            <div className="timeline-dot"></div>
            <div className="timeline-content">
              09:15 - Processing Completed
            </div>
          </div>

          <div className="timeline-item">
            <div className="timeline-dot"></div>
            <div className="timeline-content">
              09:30 - Insights Generated
            </div>
          </div>

          <div className="timeline-item">
            <div className="timeline-dot"></div>
            <div className="timeline-content">
              10:00 - Dashboard Updated
            </div>
          </div>

        </div>

      </div>

      {/* ENGINE STATUS */}

      {/* <div className="chart-card">

        <h2>⚙ Analytics Engine Status</h2>

        <div className="card-grid">

          <div className="metric-card">
            <h2>ONLINE</h2>
            <p>Analytics Engine</p>
          </div>

          <div className="metric-card">
            <h2>CONNECTED</h2>
            <p>Master DB</p>
          </div>

          <div className="metric-card">
            <h2>ACTIVE</h2>
            <p>Processing Service</p>
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

export default AnalyticsPage;