import React from "react";

export default function StatCardTask24({ title, value, trend, status }) {
  return (
    <div className="stat-card">
      <div className="stat-header">
        <h4>{title}</h4>
        {status && <span className={`status ${status.toLowerCase()}`}>{status}</span>}
      </div>

      <div className="stat-value">{value}</div>

      {trend && (
        <div className={`stat-trend ${trend >= 0 ? "up" : "down"}`}>
          {trend >= 0 ? "▲" : "▼"} {Math.abs(trend)}%
        </div>
      )}
    </div>
  );
}