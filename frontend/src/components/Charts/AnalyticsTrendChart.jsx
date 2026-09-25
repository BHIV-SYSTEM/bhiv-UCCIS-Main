import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

function AnalyticsTrendChart() {

  const data = [
    { month: "Jan", analytics: 120 },
    { month: "Feb", analytics: 180 },
    { month: "Mar", analytics: 240 },
    { month: "Apr", analytics: 210 },
    { month: "May", analytics: 320 },
    { month: "Jun", analytics: 380 }
  ];

  return (
    <div className="panel">

      <h2>Analytics Trend</h2>

      <ResponsiveContainer width="100%" height={320}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
  dataKey="month"
  label={{
    value: "Month",
    position: "insideBottom",
    offset: -1,
  }}
/>

<YAxis
  label={{
    value: "Analytics Value",
    angle: -90,
    position: "insideLeft",
  }}
/>
          <Tooltip />

          <Area
            type="monotone"
            dataKey="analytics"
            stroke="#2563eb"
            fill="#93c5fd"
          />
        </AreaChart>
      </ResponsiveContainer>

    </div>
  );
}

export default AnalyticsTrendChart;