import React from "react";

export default function AckFlowCard() {

  const flow =
`Signal → Escalation → Governance Visibility → Enforcement Request → Acknowledgement → Replay Reconstruction`;

  return (
    <div
      style={{
        marginTop: "20px",
        background: "#0b1220",
        padding: "20px",
        borderRadius: "10px",
        border: "1px solid #334155"
      }}
    >
      <h2>Acknowledgement Flow</h2>
      <div style={{ marginTop: "10px" }}>{flow}</div>
    </div>
  );
}