import React from "react";

const stages = [
  "Signal",
  "Escalation",
  "Governance Review",
  "Field Visibility",
  "Acknowledgement",
  "Recovery Validation"
];

export default function EscalationJourney() {

  return (
    <div
      style={{
        marginTop: "25px",
        background: "#1e293b",
        borderRadius: "12px",
        padding: "20px"
      }}
    >
      <h2>Escalation Progression</h2>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          marginTop: "15px"
        }}
      >
        {stages.map((stage, index) => (
          <div
            key={index}
            style={{
              padding: "12px 18px",
              background: "#0f172a",
              borderRadius: "30px",
              border: "1px solid #334155"
            }}
          >
            {stage}
          </div>
        ))}
      </div>
    </div>
  );
}