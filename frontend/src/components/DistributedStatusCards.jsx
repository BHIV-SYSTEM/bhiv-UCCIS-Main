import React from "react";

export default function DistributedStatusCards() {

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
        gap: "15px",
        marginTop: "20px"
      }}
    >
      <div style={{ background: "#0f172a", padding: "15px", borderRadius: "10px" }}>
        DISTRIBUTED VIEW: ACTIVE
      </div>

      <div style={{ background: "#0f172a", padding: "15px", borderRadius: "10px" }}>
        REPLAY INSPECTOR: STABLE
      </div>

      <div style={{ background: "#0f172a", padding: "15px", borderRadius: "10px" }}>
        CONSISTENCY CHECK: ENABLED
      </div>

      <div style={{ background: "#0f172a", padding: "15px", borderRadius: "10px" }}>
        TELEMETRY MODE: MONITORING
      </div>
    </div>
  );
}