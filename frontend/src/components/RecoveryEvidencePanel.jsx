import React from "react";

export default function RecoveryEvidencePanel({ recovery }) {

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
      <h2>Recovery Evidence Output</h2>
      {recovery}
    </div>
  );
}