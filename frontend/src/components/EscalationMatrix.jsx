import React from "react";

export default function EscalationMatrix() {
  const data = [
    { level: "Low", value: 1, action: "Monitoring" },
    { level: "Medium", value: 2, action: "Supervisor" },
    { level: "High", value: 3, action: "Department Head" },
    { level: "Critical", value: 4, action: "Principal Secretary" },
  ];

  const getColor = (value) => {
    switch (value) {
      case 1:
        return "#22c55e"; // green
      case 2:
        return "#facc15"; // yellow
      case 3:
        return "#f97316"; // orange
      case 4:
        return "#ef4444"; // red
      default:
        return "#64748b";
    }
  };

  return (
    <div style={{ width: "100%", height: "320px" }}>

      <h3 style={{ marginBottom: "12px" }}>Escalation Heatmap</h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "12px",
        }}
      >
        {data.map((item, index) => (
          <div
            key={index}
            style={{
              background: getColor(item.value),
              color: "white",
              padding: "16px",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
              transition: "0.3s",
            }}
          >
            <div style={{ fontSize: "14px", opacity: 0.9 }}>
              {item.level}
            </div>

            <div style={{ fontSize: "18px", fontWeight: "bold" }}>
              {item.action}
            </div>

            <div style={{ fontSize: "12px", marginTop: "6px" }}>
              Severity Level: {item.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}