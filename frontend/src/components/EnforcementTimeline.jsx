import React from "react";

export default function EnforcementTimeline({ log }) {

  return (
    <div
      style={{
        marginTop: "25px",
        background: "#111827",
        padding: "20px",
        borderRadius: "10px",
        whiteSpace: "pre-wrap"
      }}
    >
      <h2>Enforcement Continuity Timeline</h2>
      {log}
    </div>
  );
}