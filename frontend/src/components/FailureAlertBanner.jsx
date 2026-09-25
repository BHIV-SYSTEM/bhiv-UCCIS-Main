import React from "react";

export default function FailureAlertBanner() {

  return (
    <div
      style={{
        marginTop: "20px",
        background: "#7f1d1d",
        padding: "20px",
        borderRadius: "12px",
        border: "1px solid #ef4444"
      }}
    >
      <h2>Operational Visibility Alerts Active</h2>

      <p style={{ marginTop: "10px", lineHeight: "1.7" }}>
        Failure visibility remains active for governance monitoring,
        replay reconstruction,
        and continuity awareness.

        Alerts remain observational and non-authoritative.
      </p>
    </div>
  );
}