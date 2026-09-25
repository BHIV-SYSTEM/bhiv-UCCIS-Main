import React from "react";

export default function LineageAfter({ data }) {

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
      <h2>AFTER LINEAGE STATE (ORDERED)</h2>
      {data}
    </div>
  );
}