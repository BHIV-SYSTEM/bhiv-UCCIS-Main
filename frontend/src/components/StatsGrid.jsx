import React from "react";
import StatCard from "./StatCard";

export default function StatsGrid({ stats }) {
  return (
    <div className="stats-grid">

      <StatCard
        title="Signals"
        value={stats.signals}
        trend={12}
        status="Active"
      />

      <StatCard
        title="Incidents"
        value={stats.incidents}
        trend={-5}
        status="Open"
      />

      <StatCard
        title="Telemetry Events"
        value={stats.telemetry}
        trend={18}
        status="Live"
      />

      <StatCard
        title="Runtime Nodes"
        value={stats.runtime}
        trend={3}
        status="Stable"
      />

    </div>
  );
}