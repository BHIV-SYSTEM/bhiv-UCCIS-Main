import React from "react";

export default function GovernancePanel() {

  return (
    <div
      style={{
        marginTop: "20px",
        background: "#0f172a",
        padding: "20px",
        borderRadius: "12px"
      }}
    >
      <h2>Governance-safe Replay Visibility</h2>

      <p style={{ marginTop: "10px", lineHeight: "1.8" }}>
        Replay visibility remains observational only.
        Operational continuity is visible without
        execution authority delegation.
      </p>
    </div>
  );
}