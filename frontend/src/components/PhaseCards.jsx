import React from "react";

const PhaseCards = ({
  title,
  value,
  icon,
  color = "#2563eb"
}) => {
  return (
    <div
      className="phase-card"
      style={{
        borderLeft: `5px solid ${color}`
      }}
    >
      <div className="phase-card-header">
        <h3>{title}</h3>
        <span className="phase-icon">{icon}</span>
      </div>

      <div className="phase-card-body">
        <h1>{value}</h1>
      </div>
    </div>
  );
};

export default PhaseCards;