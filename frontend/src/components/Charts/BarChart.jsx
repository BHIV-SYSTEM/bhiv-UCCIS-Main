import React from "react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";

function CustomBarChart({ data }) {

  const BAR_COLORS = [
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
      <BarChart data={data}>

        <XAxis
          dataKey="name"
          label={{
            value: "Data Category",
            position: "insideBottom",
            offset: -5
          }}
        />

        <YAxis
          label={{
            value: "Count",
            angle: -90,
            position: "insideLeft"
          }}
        />

        <Tooltip />

        <Bar dataKey="value">

          {data.map((entry, index) => (
            <Cell
              key={index}
              fill={
                BAR_COLORS[
                  index % BAR_COLORS.length
                ]
              }
            />
          ))}

        </Bar>

      </BarChart>
    </ResponsiveContainer>
  );
}

export default CustomBarChart;