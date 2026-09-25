import React from "react";

export default function LineagePanel({ recovery }) {

  return (
    <div
      style={{
        marginTop: "25px",
        background: "#0b1220",
        padding: "20px",
        borderRadius: "10px",
        whiteSpace: "pre-wrap",
        border: "1px solid #334155"
      }}
    >
      <h2>Lineage & Continuity Proof</h2>

      {recovery}
    </div>
  );
}