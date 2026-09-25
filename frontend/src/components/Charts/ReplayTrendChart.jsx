import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell
} from "recharts";

function ReplayTrendChart() {

  const data = [
    { day: "Mon", replay: 12 },
    { day: "Tue", replay: 18 },
    { day: "Wed", replay: 15 },
    { day: "Thu", replay: 22 },
    { day: "Fri", replay: 19 },
    { day: "Sat", replay: 10 },
    { day: "Sun", replay: 7 }
  ];

  const colors = [
    "#2563eb",
    "#16a34a",
    "#f59e0b",
    "#dc2626",
    "#7c3aed",
    "#0891b2",
    "#0f766e"
  ];

  return (
    <div className="panel">

      <h2>Replay Trend</h2>

      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
  dataKey="day"
  label={{
    value: "Day",
    position: "insideBottom",
    offset: -1,
  }}
/>

<YAxis
  label={{
    value: "Replay Count",
    angle: -90,
    position: "insideLeft",
  }}
/>
          <Tooltip />

          <Bar dataKey="replay" radius={[8, 8, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={index} fill={colors[index]} />
            ))}
          </Bar>

        </BarChart>
      </ResponsiveContainer>

    </div>
  );
}

export default ReplayTrendChart;