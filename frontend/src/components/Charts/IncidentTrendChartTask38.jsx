import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Mon", incidents: 12 },
  { name: "Tue", incidents: 18 },
  { name: "Wed", incidents: 9 },
  { name: "Thu", incidents: 22 },
  { name: "Fri", incidents: 15 },
];

export default function IncidentTrendChartTask38() {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="incidents" stroke="#8884d8" />
      </LineChart>
    </ResponsiveContainer>
  );
}