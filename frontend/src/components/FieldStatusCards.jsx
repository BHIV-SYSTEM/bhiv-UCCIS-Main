import React from "react";

export default function FieldStatusCards() {

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
        FIELD ASSIGNMENT: ACTIVE
      </div>

      <div style={{ background: "#0f172a", padding: "15px", borderRadius: "10px" }}>
        ACKNOWLEDGEMENT: TRACKED
      </div>

      <div style={{ background: "#0f172a", padding: "15px", borderRadius: "10px" }}>
        TIMEOUT MONITOR: ENABLED
      </div>

      <div style={{ background: "#0f172a", padding: "15px", borderRadius: "10px" }}>
        ESCALATION AGING: ACTIVE
      </div>
    </div>
  );
}