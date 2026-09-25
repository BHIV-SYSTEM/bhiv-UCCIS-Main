import React from "react";

function TelemetryPanel({ telemetry }) {
  return (
    <div className="uccis-card">
      <h3>📡 Telemetry Intelligence Module</h3>

      <div className="stat-grid">
        <div className="stat-box">
          <h2>{telemetry.length}</h2>
          <p>Total Events</p>
        </div>

        <div className="stat-box">
          <h2>
            {telemetry.filter((t) => t.status === "SUCCESS").length}
          </h2>
          <p>Successful</p>
        </div>

        <div className="stat-box">
          <h2>
            {telemetry.filter((t) => t.status !== "SUCCESS").length}
          </h2>
          <p>Errors</p>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Signal</th>
            <th>Event</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {telemetry.slice(0, 10).map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.signal_id}</td>
              <td>{item.event_type}</td>
              <td>{item.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TelemetryPanel;