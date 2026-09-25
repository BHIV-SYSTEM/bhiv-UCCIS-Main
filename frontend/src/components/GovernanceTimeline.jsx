import React from "react";

const timeline = [
  "Signal detected",
  "Escalation initiated",
  "Governance visibility established",
  "Field acknowledgement observed",
  "Recovery continuity verified",
  "Replay reconstruction completed"
];

export default function GovernanceTimeline() {

  return (
    <div
      style={{
        marginTop: "25px",
        background: "#111827",
        borderRadius: "12px",
        padding: "20px"
      }}
    >
      <h2>Operational Timeline</h2>

      {timeline.map((item, index) => (
        <div
          key={index}
          style={{
            marginTop: "15px",
            padding: "12px",
            background: "#1e293b",
            borderRadius: "8px"
          }}
        >
          STEP {index + 1} — {item}
        </div>
      ))}
    </div>
  );
}