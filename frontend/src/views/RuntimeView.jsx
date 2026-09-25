import React from "react";
import RuntimeTrendChart from "../components/Charts/RuntimeTrendChart";

function RuntimeView() {
  const runtimeData = {
    runtimeHealth: "98%",
    activeTraces: 124,
    avgLatency: "132 ms",
    throughput: "7420/min"
  };

  return (
    <div>

      <h1 className="dashboard-title">
        Runtime Operations Center
      </h1>

      {/* KPI Cards */}

      <div className="card-grid">

        <div className="card signals">
          <h3>Runtime Health</h3>
          <h2>98%</h2>
        </div>

        <div className="card incidents">
          <h3>Active Traces</h3>
          <h2>124</h2>
        </div>

        <div className="card replay">
          <h3>Throughput</h3>
          <h2>7420</h2>
        </div>

        <div className="card escalations">
          <h3>Latency</h3>
          <h2>132ms</h2>
        </div>

      </div>

      {/* Runtime Health Chart */}

      <div className="panel">

        <RuntimeTrendChart />

      </div>

      <br />

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
          {JSON.stringify(runtimeData, null, 2)}
        </pre>

      </div> */}

      {/* Runtime Information */}

      <div className="dashboard-grid">

        <div className="panel">

          <h2>Runtime Information</h2>

          <p>
            The Runtime Engine is responsible for
            orchestration, workflow execution,
            trace management and event processing.
          </p>

          <br />

          <p>
            Current environment is operating within
            SLA thresholds with no critical runtime
            degradation detected.
          </p>

          <br />

          <p>
            Average system utilization remains at
            74% across monitored services.
          </p>

          <br />

          <p>
            Runtime scheduler and workflow engine
            continue processing trace execution
            requests successfully.
          </p>

        </div>

        {/* <div className="panel">

          <h2>Runtime Services</h2>

          <table>

            <tbody>

              <tr>
                <td>Runtime Engine</td>
                <td>🟢 Healthy</td>
              </tr>

              <tr>
                <td>Workflow Manager</td>
                <td>🟢 Healthy</td>
              </tr>

              <tr>
                <td>Scheduler</td>
                <td>🟢 Healthy</td>
              </tr>

              <tr>
                <td>Trace Processor</td>
                <td>🟡 Warning</td>
              </tr>

              <tr>
                <td>Replay Engine</td>
                <td>🟢 Healthy</td>
              </tr>

              <tr>
                <td>Evidence Engine</td>
                <td>🟢 Healthy</td>
              </tr>

              <tr>
                <td>Analytics Engine</td>
                <td>🟢 Healthy</td>
              </tr>

            </tbody>

          </table>

        </div> */}

      </div>

      {/* Active Runtime Traces */}

      <div className="panel">

        <h2>Active Runtime Traces</h2>

        <table>

          <thead>

            <tr>
              <th>Trace ID</th>
              <th>Status</th>
              <th>Latency</th>
              <th>Owner</th>
            </tr>

          </thead>

          <tbody>

            <tr>
              <td style={{ color: "#000000" }}>TRACE-1001</td>
              <td style={{ color: "#000000" }}>Running</td>
              <td style={{ color: "#000000" }}>124 ms</td>
              <td style={{ color: "#000000" }}>Runtime Team</td>
            </tr>

            <tr>
              <td style={{ color: "#000000" }}>TRACE-1002</td>
              <td style={{ color: "#000000" }}>Running</td>
              <td style={{ color: "#000000" }}>132 ms</td>
              <td style={{ color: "#000000" }}>Platform Team</td>
            </tr>

            <tr>
              <td style={{ color: "#000000" }}>TRACE-1003</td>
              <td style={{ color: "#000000" }}>Investigating</td>
              <td style={{ color: "#000000" }}>241 ms</td>
              <td style={{ color: "#000000" }}>Ops Team</td>
            </tr>

            <tr>
              <td style={{ color: "#000000" }}>TRACE-1004</td>
              <td style={{ color: "#000000" }}>Completed</td>
              <td style={{ color: "#000000" }}>101 ms</td>
              <td style={{ color: "#000000" }}>Runtime Team</td>
            </tr>

            <tr>
              <td style={{ color: "#000000" }}>TRACE-1005</td>
              <td style={{ color: "#000000" }}>Running</td>
              <td style={{ color: "#000000" }}>118 ms</td>
              <td style={{ color: "#000000" }}>Platform Team</td>
            </tr>

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default RuntimeView;