import React from "react";

const MetricCard = ({
  title,
  value,
  icon,
  status
}) => {
  return (
    <div className="metric-card">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "10px"
        }}
      >
        <h4>{title}</h4>

        {icon && (
          <span
            style={{
              fontSize: "22px"
            }}
          >
            {icon}
          </span>
        )}
      </div>

      <h2>{value}</h2>

      {status && (
        <div
          style={{
            marginTop: "10px"
          }}
        >
          <span
            className={
              status === "Healthy"
                ? "status-completed"
                : status === "Warning"
                ? "status-warning"
                : "status-open"
            }
          >
            {status}
          </span>
        </div>
      )}
    </div>
  );
};

export default MetricCard;