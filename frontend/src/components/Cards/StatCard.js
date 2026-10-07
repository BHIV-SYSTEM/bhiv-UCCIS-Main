import React from "react";

function StatCard({
  title,
  value,
  subtitle,
  level,
  icon,
}) {
  const levelConfig = {
    HIGH: {
      color: "#ef4444",
      background: "rgba(239, 68, 68, 0.12)",
      border: "#ef4444",
    },
    MODERATE: {
      color: "#f59e0b",
      background: "rgba(245, 158, 11, 0.12)",
      border: "#f59e0b",
    },
    LOW: {
      color: "#22c55e",
      background: "rgba(34, 197, 94, 0.12)",
      border: "#22c55e",
    },
  };

  const status = levelConfig[level];

  return (
    <div
      className="stat-card"
      style={{
        background: "#0b1f3a",
        border: "1px solid #1b3f70",
        borderRadius: "12px",
        padding: "18px",
        minHeight: "135px",
        width: "100%",
        boxSizing: "border-box",
        color: "#ffffff",
        boxShadow: "0 4px 14px rgba(0, 0, 0, 0.18)",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "10px",
          marginBottom: "10px",
        }}
      >
        <h3
          style={{
            margin: 0,
            color: "#b7c8df",
            fontSize: "12px",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          {title}
        </h3>

        {icon && (
          <span
            style={{
              fontSize: "20px",
            }}
          >
            {icon}
          </span>
        )}
      </div>

      {/* Value */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "9px",
          flexWrap: "wrap",
        }}
      >
        <h1
          style={{
            margin: 0,
            color: status ? status.color : "#ffffff",
            fontSize: "28px",
            lineHeight: 1.1,
            fontWeight: 800,
          }}
        >
          {value}
        </h1>

        {level && status && (
          <span
            style={{
              background: status.background,
              color: status.color,
              border: `1px solid ${status.border}`,
              borderRadius: "20px",
              padding: "4px 9px",
              fontSize: "10px",
              fontWeight: 800,
            }}
          >
            {level}
          </span>
        )}
      </div>

      {/* Subtitle */}
      {subtitle && (
        <p
          style={{
            margin: "9px 0 0",
            color: "#8fa7c4",
            fontSize: "12px",
            lineHeight: 1.4,
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}

export default StatCard;
