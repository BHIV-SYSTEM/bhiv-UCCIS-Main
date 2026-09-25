import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

function EscalationPriorityChart() {

  const data = [
    {
      name: "Critical",
      value: 5
    },
    {
      name: "High",
      value: 8
    },
    {
      name: "Medium",
      value: 12
    },
    {
      name: "Low",
      value: 7
    }
  ];

  const COLORS = [
    "#dc2626",
    "#f97316",
    "#2563eb",
    "#16a34a"
  ];

  return (
    <div className="panel">

      <h2>Escalation Priority</h2>

      <ResponsiveContainer width="100%" height={320}>
        <PieChart>

          <Pie
            data={data}
            dataKey="value"
            outerRadius={110}
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

export default EscalationPriorityChart;