import React from "react";

export default function ConcurrentTimeline({ simulation }) {

  return (
    <div
      style={{
        marginTop: "30px",
        background: "#111827",
        padding: "20px",
        borderRadius: "10px",
        whiteSpace: "pre-wrap",
        border: "1px solid #334155"
      }}
    >

      <h2>Concurrent Event Timeline</h2>

      <div style={{ marginTop: "20px" }}>
        {simulation}
      </div>

    </div>
  );

}