import React from "react";

export default function StaleTelemetryPanel({ validation }) {

  return (
    <div
      style={{
        marginTop: "25px",
        background: "#0f172a",
        padding: "20px",
        borderRadius: "10px",
        whiteSpace: "pre-wrap",
        border: "1px solid #334155"
      }}
    >
      <h2>Stale Telemetry Handling</h2>

      {validation?.staleTelemetry}
    </div>
  );
}