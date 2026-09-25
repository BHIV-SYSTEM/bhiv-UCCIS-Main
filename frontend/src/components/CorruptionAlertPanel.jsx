import React from "react";

export default function CorruptionAlertPanel() {

  return (
    <div
      style={{
        marginTop: "25px",
        background: "#3f0d12",
        borderRadius: "12px",
        padding: "20px",
        border: "1px solid #f87171"
      }}
    >
      <h2>Replay Corruption Visibility</h2>

      <p style={{ marginTop: "12px", lineHeight: "1.8" }}>
        Replay corruption indicators were identified during
        reconstruction continuity validation.

        Recovery sequencing restored operational visibility
        without granting execution authority.
      </p>
    </div>
  );
}