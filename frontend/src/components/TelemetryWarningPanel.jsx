import React from "react";

export default function TelemetryWarningPanel() {

  return (
    <div
      style={{
        marginTop: "25px",
        background: "#78350f",
        borderRadius: "12px",
        padding: "20px"
      }}
    >
      <h2>Stale Telemetry Warning</h2>

      <p style={{ marginTop: "12px", lineHeight: "1.8" }}>
        Replay telemetry became delayed beyond expected operational
        visibility thresholds.

        Reconstruction continuity remained stable while stale visibility
        indicators were surfaced to governance observers.
      </p>
    </div>
  );
}