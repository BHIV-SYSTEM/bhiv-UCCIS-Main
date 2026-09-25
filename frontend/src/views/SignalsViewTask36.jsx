import React from "react";

import SignalTrendChart from "../components/Charts/SignalTrendChart";
import SignalCategoryChart from "../components/Charts/SignalCategoryChart";

function SignalsViewTask36() {
  const signalData = {
    totalSignals: 542,
    processedSignals: 534,
    pendingSignals: 8,
    signalAccuracy: "98%"
  };

  return (
    <div>
      <h1 className="dashboard-title">
        Signals Operations Center
      </h1>

      {/* KPI Cards */}

      <div className="card-grid">
        <div className="card signals">
          <h3>Total Signals</h3>
          <h2>542</h2>
        </div>

        <div className="card incidents">
          <h3>Processed Signals</h3>
          <h2>534</h2>
        </div>

        <div className="card replay">
          <h3>Pending Signals</h3>
          <h2>8</h2>
        </div>

        <div className="card escalations">
          <h3>Accuracy</h3>
          <h2>98%</h2>
        </div>
      </div>

      {/* Charts */}

      <div className="dashboard-grid">
        <SignalTrendChart />

        <SignalCategoryChart />
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
          {JSON.stringify(signalData, null, 2)}
        </pre>
      </div> */}

      {/* Information Section */}

      <div className="dashboard-grid">
        <div className="panel">
          <h2>Signal Information</h2>

          <p>
            Signals are operational events collected from
            Runtime Engines, Telemetry Streams, Monitoring
            Systems, Security Services and Infrastructure
            Components.
          </p>

          <br />

          <p>
            Signals help detect anomalies, failures,
            bottlenecks and performance degradations
            across the platform.
          </p>

          <br />

          <p>
            Current processing accuracy remains above
            operational SLA targets.
          </p>
        </div>

        {/* <div className="panel">
          <h2>Signal Sources</h2>

          <table>
            <tbody>
              <tr>
                <td>Runtime Engine</td>
                <td>🟢 Active</td>
              </tr>

              <tr>
                <td>Telemetry Pipeline</td>
                <td>🟢 Active</td>
              </tr>

              <tr>
                <td>Infrastructure Monitor</td>
                <td>🟢 Active</td>
              </tr>

              <tr>
                <td>Analytics Engine</td>
                <td>🟢 Active</td>
              </tr>

              <tr>
                <td>Security Monitor</td>
                <td>🟡 Warning</td>
              </tr>
            </tbody>
          </table>
        </div> */}
      </div>

      {/* Active Signals */}

      <div className="panel">
        <h2>Active Signals</h2>

        <table>
          <thead>
            <tr>
              <th>Signal ID</th>
              <th>Source</th>
              <th>Priority</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td style={{ color: "#000000" }}>SIG-1001</td>
              <td style={{ color: "#000000" }}>Runtime</td>
              <td style={{ color: "#000000" }}>High</td>
              <td style={{ color: "#000000" }}>Processed</td>
            </tr>

            <tr>
              <td style={{ color: "#000000" }}>SIG-1002</td>
              <td style={{ color: "#000000" }}>Telemetry</td>
              <td style={{ color: "#000000" }}>Medium</td>
              <td style={{ color: "#000000" }}>Processed</td>
            </tr>

            <tr>
              <td style={{ color: "#000000" }}>SIG-1003</td>
              <td style={{ color: "#000000" }}>Security</td>
              <td style={{ color: "#000000" }}>Critical</td>
              <td style={{ color: "#000000" }}>Investigating</td>
            </tr>

            <tr>
              <td style={{ color: "#000000" }}>SIG-1004</td>
              <td style={{ color: "#000000" }}>Infrastructure</td>
              <td style={{ color: "#000000" }}>Low</td>
              <td style={{ color: "#000000" }}>Processed</td>
            </tr>

            <tr>
              <td style={{ color: "#000000" }}>SIG-1005</td>
              <td style={{ color: "#000000" }}>Analytics</td>
              <td style={{ color: "#000000" }}>Medium</td>
              <td style={{ color: "#000000" }}>Pending</td>
            </tr>

            <tr>
              <td style={{ color: "#000000" }}>SIG-1006</td>
              <td style={{ color: "#000000" }}>Runtime</td>
              <td style={{ color: "#000000" }}>High</td>
              <td style={{ color: "#000000" }}>Processed</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Signal Statistics */}

      {/* <div className="dashboard-grid">
        <div className="panel">
          <h2>Signal Statistics</h2>

          <p>Total Signals Today : 542</p>
          <p>Processed Successfully : 534</p>
          <p>Pending Review : 8</p>
          <p>Critical Signals : 14</p>
          <p>Average Processing Time : 120 ms</p>
        </div>

        <div className="panel">
          <h2>Operational Summary</h2>

          <p>Runtime Events : 180</p>
          <p>Telemetry Events : 140</p>
          <p>Security Events : 110</p>
          <p>Infrastructure Events : 70</p>
          <p>Analytics Events : 42</p>
        </div>
      </div> */}
    </div>
  );
}

export default SignalsViewTask36;