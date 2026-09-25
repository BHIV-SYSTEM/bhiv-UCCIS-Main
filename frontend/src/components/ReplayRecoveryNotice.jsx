import React from "react";

export default function ReplayRecoveryNotice() {

  return (
    <div
      style={{
        marginTop: "25px",
        background: "#064e3b",
        borderRadius: "12px",
        padding: "20px",
        border: "1px solid #10b981"
      }}
    >
      <h2>Replay Recovery Notice</h2>

      <p style={{ marginTop: "12px", lineHeight: "1.8" }}>
        Replay continuity was successfully reconstructed after
        interruption and delayed telemetry conditions.

        Operational visibility remained recoverable throughout replay restoration.
      </p>
    </div>
  );
}