import React from "react";

import AnalyticsTrendChart from "../components/Charts/AnalyticsTrendChart";
import AnalyticsCategoryChart from "../components/Charts/AnalyticsCategoryChart";

function AnalyticsView() {

  const analyticsData = {
    reportsGenerated: 1248,
    dashboardsActive: 42,
    insightsGenerated: 389,
    accuracyScore: "96%"
  };

  return (
    <div>

      <h1 className="dashboard-title">
        Analytics Intelligence Center
      </h1>

      {/* KPI Cards */}

      <div className="card-grid">

        <div className="card signals">
          <h3>Reports Generated</h3>
          <h2>1248</h2>
        </div>

        <div className="card incidents">
          <h3>Dashboards</h3>
          <h2>42</h2>
        </div>

        <div className="card replay">
          <h3>Insights</h3>
          <h2>389</h2>
        </div>

        <div className="card escalations">
          <h3>Accuracy</h3>
          <h2>96%</h2>
        </div>

      </div>

      {/* Charts */}

      <div className="dashboard-grid">

        <AnalyticsTrendChart />

        <AnalyticsCategoryChart />

      </div>

      {/* Backend Response */}

      {/* <div className="panel">

        <h2>Backend Response</h2>

        <pre
          style={{
            background: "#111827",
            color: "#22c55e",
            padding: "15px",
            borderRadius: "10px",
            overflowX: "auto"
          }}
        >
          {JSON.stringify(analyticsData, null, 2)}
        </pre>

      </div> */}

      {/* Information */}

      <div className="dashboard-grid">

        <div className="panel">

          <h2>Analytics Information</h2>

          <p>
            Analytics transforms operational data
            into actionable insights across runtime,
            telemetry, incidents and evidence systems.
          </p>

          <br />

          <p>
            The analytics engine continuously
            evaluates platform performance,
            operational efficiency and service health.
          </p>

          <br />

          <p>
            Generated insights support engineering,
            operations and governance decision making.
          </p>

        </div>

        {/* <div className="panel">

          <h2>Analytics Statistics</h2>

          <p>Reports Generated : 1248</p>
          <p>Dashboards Active : 42</p>
          <p>Insights Produced : 389</p>
          <p>Accuracy Score : 96%</p>
          <p>Average Processing Time : 1.8 sec</p>

        </div> */}

      </div>

      {/* Analytics Summary */}

      <div className="panel">

        <h2>Analytics Summary</h2>

        <table>

          <thead>

            <tr>
              <th>Domain</th>
              <th>Reports</th>
              <th>Insights</th>
              <th>Status</th>
            </tr>

          </thead>

          <tbody>

            <tr>
              <td style={{ color: "#000000" }}>Runtime</td>
              <td style={{ color: "#000000" }}>320</td>
              <td style={{ color: "#000000" }}>108</td>
              <td style={{ color: "#000000" }}>Healthy</td>
            </tr>

            <tr>
              <td style={{ color: "#000000" }}>Signals</td>
              <td style={{ color: "#000000" }}>240</td>
              <td style={{ color: "#000000" }}>82</td>
              <td style={{ color: "#000000" }}>Healthy</td>
            </tr>

            <tr>
              <td style={{ color: "#000000" }}>Telemetry</td>
              <td style={{ color: "#000000" }}>290</td>
              <td style={{ color: "#000000" }}>96</td>
              <td style={{ color: "#000000" }}>Healthy</td>
            </tr>

            <tr>
              <td style={{ color: "#000000" }}>Incidents</td>
              <td style={{ color: "#000000" }}>210</td>
              <td style={{ color: "#000000" }}>67</td>
              <td style={{ color: "#000000" }}>Healthy</td>
            </tr>

            <tr>
              <td style={{ color: "#000000" }}>Evidence</td>
              <td style={{ color: "#000000" }}>188</td>
              <td style={{ color: "#000000" }}>36</td>
              <td style={{ color: "#000000" }}>Healthy</td>
            </tr>

          </tbody>

        </table>

      </div>

      {/* Top Insights */}

      <div className="panel">

        <h2>Top Insights</h2>

        <ul>
          <li>Runtime health improved by 12% this month.</li>
          <li>Incident resolution time reduced by 18%.</li>
          <li>Replay success rate reached 97%.</li>
          <li>Telemetry throughput increased by 22%.</li>
          <li>Evidence verification efficiency improved by 15%.</li>
        </ul>

      </div>

    </div>
  );
}

export default AnalyticsView;