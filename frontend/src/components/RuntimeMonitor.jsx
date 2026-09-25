import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function RuntimeMonitor() {
  const data = [
    { name: "Backend", value: 120 },
    { name: "Telemetry", value: 110 },
    { name: "Replay", value: 115 },
    { name: "Escalation", value: 118 },
  ];

  return (
    <div style={{ width: "100%", height: "320px", background: "#111827" }}>
      <BarChart width={500} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" fill="#22c55e" />
      </BarChart>
    </div>
  );
}