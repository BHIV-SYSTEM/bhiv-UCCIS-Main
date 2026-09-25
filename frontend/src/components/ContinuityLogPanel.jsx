import React from "react";

export default function ContinuityLogPanel({ validation }) {

  return (
    <div
      style={{
        marginTop: "25px",
        background: "#0f172a",
        padding: "20px",
        borderRadius: "10px",
        whiteSpace: "pre-wrap",
        border: "1px solid #334155"
      }}
    >
      <h2>Replay Linkage Proof</h2>

      {validation?.replayLinkage}
    </div>
  );
}