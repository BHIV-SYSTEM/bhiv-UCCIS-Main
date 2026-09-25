import React from "react";

export default function DownstreamPanel({ validation }) {

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
      <h2>Downstream Continuity Visibility</h2>

      {validation?.downstreamVisibility}
    </div>
  );
}