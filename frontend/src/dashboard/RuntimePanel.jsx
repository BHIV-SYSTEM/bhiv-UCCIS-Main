import React from "react";

function RuntimePanel({ signals }) {
  return (
    <div className="uccis-card">
      <h3>⚙ Runtime Monitor</h3>

      <div className="runtime-grid">
        <div className="runtime-item">
          <span>Signals</span>
          <strong>{signals.length}</strong>
        </div>

        <div className="runtime-item">
          <span>Backend</span>
          <strong>ONLINE</strong>
        </div>

        <div className="runtime-item">
          <span>Telemetry</span>
          <strong>ACTIVE</strong>
        </div>

        <div className="runtime-item">
          <span>Replay</span>
          <strong>READY</strong>
        </div>
      </div>
    </div>
  );
}

export default RuntimePanel;