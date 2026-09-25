import React from "react";

export default function LineageBefore({ data }) {

  return (
    <div
      style={{
        marginTop: "25px",
        background: "#111827",
        padding: "20px",
        borderRadius: "10px",
        whiteSpace: "pre-wrap"
      }}
    >
      <h2>BEFORE LINEAGE STATE</h2>
      {data}
    </div>
  );
}