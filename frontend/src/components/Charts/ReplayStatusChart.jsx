import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

function ReplayStatusChart() {

  const data = [
    { name: "Completed", value: 120 },
    { name: "Running", value: 22 },
    { name: "Failed", value: 8 },
    { name: "Queued", value: 14 }
  ];

  const COLORS = [
    "#16a34a",
    "#2563eb",
    "#dc2626",
    "#f59e0b"
  ];

  return (
    <div className="panel">

      <h2>Replay Status</h2>

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

export default ReplayStatusChart;