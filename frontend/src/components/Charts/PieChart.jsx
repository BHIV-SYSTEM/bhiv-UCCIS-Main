import React from "react";

import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend
} from "recharts";

function CustomPieChart({ data }) {

  const PIE_COLORS = [
    "#2563eb", // Signals - Blue
    "#16a34a", // Telemetry - Green
    "#f59e0b", // Incidents - Orange
    "#dc2626"  // Logs - Red
  ];

  return (
    <ResponsiveContainer
      width="100%"
      height={300}
    >
      <PieChart>

        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          outerRadius={100}
          label
        >

          {data.map((entry, index) => (
            <Cell
              key={index}
              fill={
                PIE_COLORS[
                  index % PIE_COLORS.length
                ]
              }
            />
          ))}

        </Pie>

        <Tooltip />

        <Legend
          verticalAlign="bottom"
          align="center"
          layout="horizontal"
          iconType="circle"
        />

      </PieChart>
    </ResponsiveContainer>
  );
}

export default CustomPieChart;