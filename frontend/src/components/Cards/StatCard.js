import React from "react";

function StatCard({
  title,
  value,
  subtitle
}) {

  return (

    <div className="stat-card">

      <h3>{title}</h3>

      <h1>{value}</h1>

      <p>{subtitle}</p>

    </div>
  );
}

export default StatCard;