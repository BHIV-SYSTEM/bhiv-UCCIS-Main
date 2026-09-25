import React from "react";

export default function OperatorNodesPanel({ nodes }) {

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
      <h2>Operator Node Views</h2>

      {nodes?.map((n, i) => (
        <div key={i} style={{ marginBottom: "10px" }}>
          NODE: {n.node} | VIEW: {n.view} | LATENCY: {n.latency_ms}ms
        </div>
      ))}
    </div>
  );
}