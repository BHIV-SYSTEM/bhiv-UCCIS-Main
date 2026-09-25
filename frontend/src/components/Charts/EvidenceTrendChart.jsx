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

function EvidenceTrendChart() {

  const data = [
    { month: "Jan", evidence: 45 },
    { month: "Feb", evidence: 52 },
    { month: "Mar", evidence: 61 },
    { month: "Apr", evidence: 58 },
    { month: "May", evidence: 72 },
    { month: "Jun", evidence: 69 }
  ];

  const colors = [
    "#2563eb",
    "#16a34a",
    "#dc2626",
    "#f59e0b",
    "#7c3aed",
    "#0891b2"
  ];

  return (
    <div className="panel">

      <h2>Evidence Collection Trend</h2>

      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data}>
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
    value: "Evidence Count",
    angle: -90,
    position: "insideLeft",
  }}
/>
          <Tooltip />

          <Bar dataKey="evidence">
            {data.map((item, index) => (
              <Cell key={index} fill={colors[index]} />
            ))}
          </Bar>

        </BarChart>
      </ResponsiveContainer>

    </div>
  );
}

export default EvidenceTrendChart;