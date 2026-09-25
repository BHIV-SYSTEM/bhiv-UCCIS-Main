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

function EscalationTrendChart() {

  const data = [
    { day: "Mon", escalations: 3 },
    { day: "Tue", escalations: 5 },
    { day: "Wed", escalations: 4 },
    { day: "Thu", escalations: 7 },
    { day: "Fri", escalations: 6 },
    { day: "Sat", escalations: 2 },
    { day: "Sun", escalations: 1 }
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

      <h2>Escalation Trend</h2>

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
    value: "Escalation Count",
    angle: -90,
    position: "insideLeft",
  }}
/>
          <Tooltip />

          <Bar dataKey="escalations" radius={[8, 8, 0, 0]}>
            {data.map((entry, index) => (
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

export default EscalationTrendChart;