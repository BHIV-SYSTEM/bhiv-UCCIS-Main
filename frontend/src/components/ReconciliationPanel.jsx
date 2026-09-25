import React from "react";

export default function ReconciliationPanel({ reconciliation }) {

  return (
    <div
      style={{
        marginTop: "30px",
        background: "#1e293b",
        padding: "20px",
        borderRadius: "10px",
        whiteSpace: "pre-wrap",
        border: "1px solid #475569"
      }}
    >

      <h2>Conflict Reconciliation Output</h2>

      <div style={{ marginTop: "20px" }}>
        {reconciliation}
      </div>

    </div>
  );

}