import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

function SignalCategoryChart() {
  const data = [
    {
      name: "Runtime",
      value: 180
    },
    {
      name: "Telemetry",
      value: 140
    },
    {
      name: "Security",
      value: 110
    },
    {
      name: "Infrastructure",
      value: 70
    },
    {
      name: "Analytics",
      value: 42
    }
  ];

  const COLORS = [
    "#2563eb",
    "#16a34a",
    "#dc2626",
    "#ca8a04",
    "#7c3aed"
  ];

  return (
    <div className="panel">
      <h2>Signal Categories</h2>

      <ResponsiveContainer width="100%" height={320}>
        <PieChart>

          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={110}
            dataKey="value"
            label
          >
            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={COLORS[index]}
              />
            ))}
          </Pie>

          <Tooltip />

          <Legend />

        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default SignalCategoryChart;