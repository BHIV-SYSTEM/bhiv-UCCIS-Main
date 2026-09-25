import React from "react";

export default function StabilityInspectorLog({ validation }) {

  return (
    <div
      style={{
        marginTop: "25px",
        background: "#1e293b",
        padding: "20px",
        borderRadius: "10px",
        whiteSpace: "pre-wrap"
      }}
    >
      <h2>Inspector Stability Log</h2>

      {validation?.consistency}
    </div>
  );
}