import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

function AnalyticsCategoryChart() {

  const data = [
    { name: "Runtime", value: 35 },
    { name: "Signals", value: 20 },
    { name: "Telemetry", value: 18 },
    { name: "Incidents", value: 15 },
    { name: "Evidence", value: 12 }
  ];

  const COLORS = [
    "#2563eb",
    "#16a34a",
    "#dc2626",
    "#f59e0b",
    "#7c3aed"
  ];

  return (
    <div className="panel">

      <h2>Analytics Categories</h2>

      <ResponsiveContainer width="100%" height={320}>
        <PieChart>

          <Pie
            data={data}
            dataKey="value"
            outerRadius={110}
            label
          >
            {data.map((item, index) => (
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

export default AnalyticsCategoryChart;