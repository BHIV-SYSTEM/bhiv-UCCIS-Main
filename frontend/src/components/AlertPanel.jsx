import React from "react";

// 🔥 Simple mapping
const getRecommendation = (alert) => {
  switch (alert) {
    case "HIGH_TRAFFIC":
      return "Increase signal timing / deploy traffic police";
    case "HIGH_VIOLATIONS":
      return "Deploy traffic police / enforce penalties";
    case "HIGH_CONGESTION":
      return "Divert traffic / optimize routes";
    default:
      return "Monitor situation";
  }
};

const AlertPanel = ({ zone }) => {
  if (!zone.alerts || zone.alerts.length === 0) {
    return <p style={{ color: "#999" }}>No alerts</p>;
  }

  return (
    <div style={{
      marginTop: "15px",
      padding: "10px",
      borderRadius: "10px",
      background: "rgba(255,0,0,0.1)"
    }}>
      <strong>Alerts:</strong>

      {zone.alerts.map((alert, index) => (
        <div key={index} style={{ marginTop: "10px" }}>
          
          {/* Alert */}
          <div style={{ color: "#ff4d4f", fontWeight: "bold" }}>
            🚨 {alert} — {zone.name}
          </div>

          {/* Recommendation */}
          <div style={{ marginLeft: "10px", color: "#fff" }}>
            👉 {getRecommendation(alert)}
          </div>

        </div>
      ))}
    </div>
  );
};

export default AlertPanel;