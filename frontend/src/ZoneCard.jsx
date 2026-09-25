import React, { useState } from "react";

const ZoneCard = ({ zone, onExecute }) => {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);

    await onExecute(
      zone.trace_id,
      zone.decision_type
    );

    setLoading(false);
  };

  return (
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "15px",
        margin: "10px",
        backgroundColor:
          zone.decision_type === "HIGH_PRIORITY"
            ? "#ffe5e5"
            : zone.decision_type === "MEDIUM"
            ? "#fff7d6"
            : "#e6ffe6",
        color: "#000000",
      }}
    >
      {/* Zone Name */}
      <h3
        style={{
          margin: "0 0 15px 0",
          color: "#000000",
          fontWeight: "bold",
          fontSize: "24px",
        }}
      >
        {zone.zone_id}
      </h3>

      {/* Risk Score */}
      <p
        style={{
          margin: "8px 0",
          fontSize: "18px",
          color: "#000000",
        }}
      >
        <strong style={{ color: "#000000" }}>Risk Score:</strong>{" "}
        <span style={{ color: "#000000" }}>
          {zone.risk_score}
        </span>
      </p>

      {/* Decision */}
      <p
        style={{
          margin: "8px 0",
          fontSize: "18px",
          color: "#000000",
        }}
      >
        <strong style={{ color: "#000000" }}>Decision:</strong>{" "}
        <span style={{ color: "#000000" }}>
          {zone.decision_type}
        </span>
      </p>

      {/* Trigger Button */}
      <button
        onClick={handleClick}
        disabled={loading}
        style={{
          marginTop: "15px",
          padding: "10px 18px",
          backgroundColor: "#1677ff",
          color: "#ffffff",
          border: "none",
          borderRadius: "6px",
          cursor: loading ? "not-allowed" : "pointer",
          fontWeight: "bold",
          fontSize: "15px",
        }}
      >
        {loading ? "Executing..." : "Trigger Action"}
      </button>
    </div>
  );
};

export default ZoneCard;