import React from "react";

function SystemHealthPage() {
  const services = [
    {
      name: "Backend API",
      status: "ONLINE",
      info: "Response: 122 ms",
      className: "online",
    },
    {
      name: "Master DB",
      status: "ONLINE",
      info: "Connections: 48",
      className: "online",
    },
    {
      name: "Telemetry Engine",
      status: "ONLINE",
      info: "Signals: 128",
      className: "online",
    },
    {
      name: "Replay Engine",
      status: "ONLINE",
      info: "Sessions: 12",
      className: "online",
    },
    {
      name: "GIS Engine",
      status: "WARNING",
      info: "Latency: 450 ms",
      className: "warning",
    },
    {
      name: "Analytics Engine",
      status: "ONLINE",
      info: "Jobs: 34",
      className: "online",
    },
  ];

  return (
    <div>

      {/* HEALTH SCORE */}

      <div className="health-score-card">
        <h1>98%</h1>
        <p>Overall System Health</p>
      </div>

      {/* KPI CARDS */}

      <div className="card-grid">

        <div className="metric-card">
          <h2>14</h2>
          <p>Services Running</p>
        </div>

        <div className="metric-card">
          <h2>2</h2>
          <p>Warnings</p>
        </div>

        <div className="metric-card">
          <h2>0</h2>
          <p>Critical Failures</p>
        </div>

        <div className="metric-card">
          <h2>99.8%</h2>
          <p>Uptime</p>
        </div>

      </div>

      {/* LIVE SERVICE STATUS */}

      <div className="chart-card">

        <h2>🟢 Live Service Status</h2>

        <div className="service-status-grid">

          {services.map((service, index) => (
            <div
              key={index}
              className={`status-card ${service.className}`}
            >
              <h3>{service.name}</h3>
              <h1>{service.status}</h1>
              <p>{service.info}</p>
            </div>
          ))}

        </div>

      </div>

      {/* RESOURCE UTILIZATION */}

      <div className="chart-card">

        <h2>⚡ Resource Utilization</h2>

        <div className="resource-grid">

          <div className="resource-card cpu">

            <h3>CPU Usage</h3>

            <h1>62%</h1>

            <div className="mini-bar">
              <div
                className="mini-fill"
                style={{ width: "62%" }}
              ></div>
            </div>

          </div>

          <div className="resource-card memory">

            <h3>Memory Usage</h3>

            <h1>74%</h1>

            <div className="mini-bar">
              <div
                className="mini-fill"
                style={{ width: "74%" }}
              ></div>
            </div>

          </div>

          <div className="resource-card disk">

            <h3>Disk Usage</h3>

            <h1>48%</h1>

            <div className="mini-bar">
              <div
                className="mini-fill"
                style={{ width: "48%" }}
              ></div>
            </div>

          </div>

        </div>

      </div>

      {/* API HEALTH */}

      <div className="chart-card">

        <h2>🌐 API Health Monitor</h2>

        <table className="runtime-table" style={{ color: "#000000"}}>

          <thead>
            <tr>
              <th>API</th>
              <th>Latency</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>

            <tr>
              <td style={{ color: "#000000"}}>/api/signals</td>
              <td style={{ color: "#000000"}}>122 ms</td>
              <td style={{ color: "#000000"}}>Healthy</td>
            </tr>

            <tr>
              <td style={{ color: "#000000"}}>/api/incidents</td>
              <td style={{ color: "#000000"}}>95 ms</td>
              <td style={{ color: "#000000"}}>Healthy</td>
            </tr>

            <tr>
              <td style={{ color: "#000000"}}>/api/replay</td>
              <td style={{ color: "#000000"}}>141 ms</td>
              <td style={{ color: "#000000"}}>Healthy</td>
            </tr>

          </tbody>

        </table>

      </div>

      {/* ACTIVE ALERTS */}

      {/* <div className="chart-card">

        <h2>🔔 Active Alerts</h2>

        <div className="alert warning">
          GIS Engine experiencing increased latency
        </div>

        <div className="alert info">
          Telemetry queue processing normally
        </div>

      </div> */}

      {/* SYSTEM TIMELINE */}

      <div className="chart-card">

        <h2>🕒 System Events Timeline</h2>

        <div className="timeline">

          <div className="timeline-item">
            <div className="timeline-dot"></div>
            <div className="timeline-content">
              09:00 - System Startup Complete
            </div>
          </div>

          <div className="timeline-item">
            <div className="timeline-dot"></div>
            <div className="timeline-content">
              10:15 - Database Backup Success
            </div>
          </div>

          <div className="timeline-item">
            <div className="timeline-dot"></div>
            <div className="timeline-content">
              11:05 - GIS Latency Warning
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

export default SystemHealthPage;