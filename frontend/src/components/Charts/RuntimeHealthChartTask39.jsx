import React from "react";

const RuntimeHealthChartTask39 = ({
  health = "Healthy"
}) => {
  return (
    <div className="chart-card">
      <h3>Runtime Health</h3>

      <div
        style={{
          fontSize: "48px",
          marginTop: "20px",
          textAlign: "center"
        }}
      >
        {health === "Healthy"
          ? "🟢"
          : health === "Warning"
          ? "🟡"
          : "🔴"}
      </div>

      <h2
        style={{
          textAlign: "center",
          marginTop: "15px"
        }}
      >
        {health}
      </h2>
    </div>
  );
};

export default RuntimeHealthChartTask39;