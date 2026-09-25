import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

function EvidenceTypeChart() {

  const data = [
    { name: "Logs", value: 120 },
    { name: "Metrics", value: 80 },
    { name: "Screenshots", value: 45 },
    { name: "Trace Files", value: 65 },
    { name: "Reports", value: 35 }
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

      <h2>Evidence Types</h2>

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

export default EvidenceTypeChart;