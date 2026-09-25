import React from "react";

const timeline = [
  "Signal",
  "Escalation",
  "Concurrent Operators",
  "Replay Reconstruction",
  "Recovery",
  "Validation"
];

export default function ReplayTimeline() {

  return (
    <div
      style={{
        marginTop: "20px",
        background: "#111827",
        padding: "20px",
        borderRadius: "12px"
      }}
    >
      <h2>Operational Timeline</h2>

      <div
        style={{
          display: "flex",
          gap: "10px",
          marginTop: "20px",
          flexWrap: "wrap"
        }}
      >
        {timeline.map((t, i) => (
          <div
            key={i}
            style={{
              background: "#1e293b",
              padding: "12px 18px",
              borderRadius: "30px"
            }}
          >
            {t}
          </div>
        ))}
      </div>
    </div>
  );
}