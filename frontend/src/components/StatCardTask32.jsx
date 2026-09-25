import React from "react";

const StatCardTask32 = ({
  title,
  value,
}) => {
  return (
    <div className="stat-card">
      <h3>{title}</h3>
      <h1>{value ?? 0}</h1>
    </div>
  );
};

export default StatCardTask32;