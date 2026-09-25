import React from "react";

function SettingsView() {
  const settingsData = {
    environment: "Development",
    version: "1.0.0",
    region: "India",
    database: "MongoDB",
    runtime: "Node.js",
    frontend: "React",
    uptime: "99.98%"
  };

  return (
    <div>

      <h1 className="dashboard-title">
        System Settings
      </h1>

      {/* KPI Cards */}

      <div className="card-grid">

        <div className="card signals">
          <h3>Environment</h3>
          <h2>Development</h2>
        </div>

        <div className="card incidents">
          <h3>Version</h3>
          <h2>1.0.0</h2>
        </div>

        <div className="card replay">
          <h3>Region</h3>
          <h2>India</h2>
        </div>

        <div className="card escalations">
          <h3>Uptime</h3>
          <h2>99.98%</h2>
        </div>

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
          {JSON.stringify(settingsData, null, 2)}
        </pre>

      </div> */}

      {/* Configuration */}

      {/* <div className="dashboard-grid">

        <div className="panel">

          <h2>Platform Information</h2>

          <table>
            <tbody>

              <tr>
                <td>Application Name</td>
                <td>UCCIS Runtime Engine</td>
              </tr>

              <tr>
                <td>Environment</td>
                <td>Development</td>
              </tr>

              <tr>
                <td>Version</td>
                <td>1.0.0</td>
              </tr>

              <tr>
                <td>Region</td>
                <td>India</td>
              </tr>

              <tr>
                <td>Uptime</td>
                <td>99.98%</td>
              </tr>

            </tbody>
          </table>

        </div>

        <div className="panel">

          <h2>Runtime Configuration</h2>

          <table>
            <tbody>

              <tr>
                <td>Runtime Engine</td>
                <td>Node.js</td>
              </tr>

              <tr>
                <td>Frontend</td>
                <td>React</td>
              </tr>

              <tr>
                <td>Database</td>
                <td>MongoDB</td>
              </tr>

              <tr>
                <td>API Server</td>
                <td>Express.js</td>
              </tr>

              <tr>
                <td>Status</td>
                <td>🟢 Running</td>
              </tr>

            </tbody>
          </table>

        </div>

      </div>

      {/* Security & Database */}

      {/* <div className="dashboard-grid">

        <div className="panel">

          <h2>Security Settings</h2>

          <table>
            <tbody>

              <tr>
                <td>JWT Authentication</td>
                <td>Enabled</td>
              </tr>

              <tr>
                <td>Role-Based Access</td>
                <td>Enabled</td>
              </tr>

              <tr>
                <td>Audit Logging</td>
                <td>Enabled</td>
              </tr>

              <tr>
                <td>Encryption</td>
                <td>AES-256</td>
              </tr>

            </tbody>
          </table>

        </div>

        <div className="panel">

          <h2>Database Configuration</h2>

          <table>
            <tbody>

              <tr>
                <td>Database</td>
                <td>MongoDB</td>
              </tr>

              <tr>
                <td>Collections</td>
                <td>24</td>
              </tr>

              <tr>
                <td>Active Connections</td>
                <td>18</td>
              </tr>

              <tr>
                <td>Status</td>
                <td>🟢 Connected</td>
              </tr>

            </tbody>
          </table>

        </div>

      </div>

      {/* Feature Flags */}

      {/* <div className="panel">

        <h2>Feature Flags</h2>

        <table>

          <thead>
            <tr>
              <th>Feature</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>

            <tr>
              <td>Replay Engine</td>
              <td>Enabled</td>
            </tr>

            <tr>
              <td>Telemetry Collection</td>
              <td>Enabled</td>
            </tr>

            <tr>
              <td>Analytics Engine</td>
              <td>Enabled</td>
            </tr>

            <tr>
              <td>Evidence Repository</td>
              <td>Enabled</td>
            </tr>

            <tr>
              <td>Incident Management</td>
              <td>Enabled</td>
            </tr>

          </tbody>

        </table>

      </div> */}

      {/* Deployment Information */}

      {/* <div className="panel">

        <h2>Deployment Information</h2>

        <table>

          <thead>
            <tr>
              <th>Property</th>
              <th>Value</th>
            </tr>
          </thead>

          <tbody>

            <tr>
              <td>Deployment Type</td>
              <td>Production Runtime</td>
            </tr>

            <tr>
              <td>Build Version</td>
              <td>2026.06.22</td>
            </tr>

            <tr>
              <td>Release Channel</td>
              <td>Stable</td>
            </tr>

            <tr>
              <td>Server Region</td>
              <td>India</td>
            </tr>

            <tr>
              <td>Last Deployment</td>
              <td>22-Jun-2026</td>
            </tr>

          </tbody>

        </table>

      </div> */}

      {/* About */}

      <div className="panel">

        <h2>About UCCIS</h2>

        <p>
          UCCIS Production Runtime Engine is a centralized
          command center for monitoring runtime execution,
          telemetry pipelines, incidents, escalations,
          replay operations, evidence management and
          analytics intelligence.
        </p>

      </div>

    </div>
  );
}

export default SettingsView;