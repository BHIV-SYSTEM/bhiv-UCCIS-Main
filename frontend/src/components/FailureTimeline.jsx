import React from "react";

const failures = [
  "Stale telemetry detected",
  "Operator disconnected from replay stream",
  "Delayed acknowledgement observed",
  "Replay corruption interruption identified",
  "Recovery reconstruction completed"
];

export default function FailureTimeline() {

  return (
    <div
      style={{
        marginTop: "25px",
        background: "#111827",
        borderRadius: "12px",
        padding: "20px"
      }}
    >
      <h2>Failure Visibility Timeline</h2>

      {failures.map((f, i) => (
        <div
          key={i}
          style={{
            marginTop: "12px",
            background: "#1e293b",
            padding: "14px",
            borderRadius: "8px"
          }}
        >
          EVENT {i + 1} — {f}
        </div>
      ))}
    </div>
  );
}