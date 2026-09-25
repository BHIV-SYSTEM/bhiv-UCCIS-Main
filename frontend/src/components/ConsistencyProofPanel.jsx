import React from "react";

export default function ConsistencyProofPanel({ validation }) {

  return (
    <div
      style={{
        marginTop: "25px",
        background: "#0b1220",
        padding: "20px",
        borderRadius: "10px",
        border: "1px solid #334155",
        whiteSpace: "pre-wrap"
      }}
    >
      <h2>Multi-Operator Consistency Proof</h2>

      {validation?.operatorConsistency}
    </div>
  );
}