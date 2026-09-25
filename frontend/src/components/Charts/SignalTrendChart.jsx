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

function SignalTrendChart() {
  const data = [
    { day: "Mon", signals: 420 },
    { day: "Tue", signals: 510 },
    { day: "Wed", signals: 480 },
    { day: "Thu", signals: 560 },
    { day: "Fri", signals: 542 },
    { day: "Sat", signals: 390 },
    { day: "Sun", signals: 310 }
  ];

  const colors = [
    "#2563eb",
    "#0891b2",
    "#16a34a",
    "#ca8a04",
    "#dc2626",
    "#7c3aed",
    "#0f766e"
  ];

  return (
    <div className="panel">
      <h2>Signal Trend</h2>

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
    value: "Signal Count",
    angle: -90,
    position: "insideLeft",
  }}
/>

          <Tooltip />

          <Bar dataKey="signals" radius={[8, 8, 0, 0]}>
            {data.map((item, index) => (
              <Cell
                key={index}
                fill={colors[index]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default SignalTrendChart;