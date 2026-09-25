import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip
} from "recharts";

const ZoneChart = () => {
  const data = [
    { name: "1", v: 40 },
    { name: "2", v: 55 },
    { name: "3", v: 65 },
    { name: "4", v: 70 },
    { name: "5", v: 80 }
  ];

  return (
    <ResponsiveContainer width="100%" height={120}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" hide />
        <YAxis hide />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="v"
          stroke="#4ade80"
          strokeWidth={2}
          dot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ZoneChart;