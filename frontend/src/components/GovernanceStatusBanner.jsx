import React from "react";

export default function GovernanceStatusBanner() {

  return (
    <div
      style={{
        marginTop: "20px",
        background: "#0f172a",
        borderRadius: "12px",
        padding: "20px",
        border: "1px solid #334155"
      }}
    >
      <h2>Replay Visibility Status</h2>

      <p style={{ marginTop: "10px", color: "#cbd5e1" }}>
        Replay visibility is active for governance review,
        continuity validation,
        and operational understanding.

        No execution authority is delegated through replay visibility.
      </p>
    </div>
  );
}