import React from "react";

import TelemetryTrendChart from "../components/Charts/TelemetryTrendChart";
import TelemetrySourceChart from "../components/Charts/TelemetrySourceChart";

function TelemetryViewTask36() {
  const telemetryData = {
    totalEvents: 7420,
    processedEvents: 7358,
    failedEvents: 62,
    throughput: "98%"
  };

  return (
    <div>

      <h1 className="dashboard-title">
        Telemetry Operations Center
      </h1>

      {/* KPI Cards */}

      <div className="card-grid">

        <div className="card signals">
          <h3>Total Events</h3>
          <h2>7420</h2>
        </div>

        <div className="card incidents">
          <h3>Processed</h3>
          <h2>7358</h2>
        </div>

        <div className="card replay">
          <h3>Failed</h3>
          <h2>62</h2>
        </div>

        <div className="card escalations">
          <h3>Throughput</h3>
          <h2>98%</h2>
        </div>

      </div>

      {/* Charts */}

      <div className="dashboard-grid">

        <TelemetryTrendChart />

        <TelemetrySourceChart />

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
          {JSON.stringify(telemetryData, null, 2)}
        </pre>

      </div> */}

      {/* Information */}

      <div className="dashboard-grid">

        <div className="panel">

          <h2>Telemetry Information</h2>

          <p>
            Telemetry captures real-time operational
            events from runtime engines, services,
            infrastructure components and monitoring
            systems.
          </p>

          <br />

          <p>
            Telemetry data enables monitoring,
            troubleshooting and performance analysis
            across the UCCIS platform.
          </p>

          <br />

          <p>
            Current telemetry throughput remains
            within defined SLA targets.
          </p>

        </div>

        {/* <div className="panel">

          <h2>Telemetry Services</h2>

          <table>

            <tbody>

              <tr>
                <td>Kafka Stream</td>
                <td>🟢 Healthy</td>
              </tr>

              <tr>
                <td>Redis Queue</td>
                <td>🟢 Healthy</td>
              </tr>

              <tr>
                <td>Elastic Search</td>
                <td>🟢 Healthy</td>
              </tr>

              <tr>
                <td>Metrics Collector</td>
                <td>🟢 Healthy</td>
              </tr>

              <tr>
                <td>Log Processor</td>
                <td>🟡 Warning</td>
              </tr>

            </tbody>

          </table>

        </div> */}

      </div>

      {/* Active Events */}

      <div className="panel">

        <h2>Active Telemetry Events</h2>

        <table>

          <thead>

            <tr>
              <th>Event ID</th>
              <th>Source</th>
              <th>Type</th>
              <th>Status</th>
            </tr>

          </thead>

          <tbody>

            <tr>
              <td style={{ color: "#000000" }}>EVT-1001</td>
              <td style={{ color: "#000000" }}>Runtime</td>
              <td style={{ color: "#000000" }}>Performance</td>
              <td style={{ color: "#000000" }}>Processed</td>
            </tr>

            <tr>
              <td style={{ color: "#000000" }}>EVT-1002</td>
              <td style={{ color: "#000000" }}>Telemetry</td>
              <td style={{ color: "#000000" }}>Metrics</td>
              <td style={{ color: "#000000" }}>Processed</td>
            </tr>

            <tr>
              <td style={{ color: "#000000" }}>EVT-1003</td>
              <td style={{ color: "#000000" }}>Infrastructure</td>
              <td style={{ color: "#000000" }}>Alert</td>
              <td style={{ color: "#000000" }}>Investigating</td>
            </tr>

            <tr>
              <td style={{ color: "#000000" }}>EVT-1004</td>
              <td style={{ color: "#000000" }}>Security</td>
              <td style={{ color: "#000000" }}>Audit</td>
              <td style={{ color: "#000000" }}>Processed</td>
            </tr>

            <tr>
              <td style={{ color: "#000000" }}>EVT-1005</td>
              <td style={{ color: "#000000" }}>Analytics</td>
              <td style={{ color: "#000000" }}>Report</td>
              <td style={{ color: "#000000" }}>Pending</td>
            </tr>

          </tbody>

        </table>

      </div>

      {/* Statistics */}

      {/* <div className="dashboard-grid">

        <div className="panel">

          <h2>Telemetry Statistics</h2>

          <p>Total Events Today : 7420</p>
          <p>Successful Events : 7358</p>
          <p>Failed Events : 62</p>
          <p>Average Processing Time : 98 ms</p>
          <p>Peak Throughput : 8200/min</p>

        </div>

        <div className="panel">

          <h2>Operational Summary</h2>

          <p>Runtime Events : 2600</p>
          <p>Infrastructure Events : 1800</p>
          <p>Security Events : 1200</p>
          <p>Analytics Events : 920</p>
          <p>Monitoring Events : 900</p>

        </div>

      </div> */}

    </div>
  );
}

export default TelemetryViewTask36;