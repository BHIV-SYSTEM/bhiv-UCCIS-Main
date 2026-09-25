import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

function TelemetrySourceChart() {

  const data = [
    { name: "Runtime", value: 2600 },
    { name: "Infrastructure", value: 1800 },
    { name: "Security", value: 1200 },
    { name: "Analytics", value: 920 },
    { name: "Monitoring", value: 900 }
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

      <h2>Telemetry Sources</h2>

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

export default TelemetrySourceChart;