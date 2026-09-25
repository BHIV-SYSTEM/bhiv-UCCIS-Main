import React from "react";

export default function Topbar({ phase }) {

  return (
    <div
      style={{
        background: "#0f172a",
        padding: "20px",
        borderRadius: "12px"
      }}
    >
      <h1>
        Distributed Replay Observability Dashboard
      </h1>

      <p style={{ marginTop: "10px", color: "#94a3b8" }}>
        Active Phase: {phase.toUpperCase()}
      </p>
    </div>
  );
}