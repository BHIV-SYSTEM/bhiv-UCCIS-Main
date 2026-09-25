import React from "react";

export default function OperatorDisconnectCard() {

  return (
    <div
      style={{
        marginTop: "25px",
        background: "#450a0a",
        borderRadius: "12px",
        padding: "20px",
        border: "1px solid #dc2626"
      }}
    >
      <h2>Disconnected Operator Alert</h2>

      <p style={{ marginTop: "12px", lineHeight: "1.8" }}>
        One replay observer disconnected from the distributed
        visibility layer.

        Replay reconstruction continuity remained preserved
        across remaining observers.
      </p>
    </div>
  );
}