import React from "react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

function CustomLineChart({ data }) {
  return (
    <ResponsiveContainer
      width="100%"
      height={300}
    >
      <LineChart data={data}>
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
        <Line
          type="monotone"
          dataKey="value"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default CustomLineChart;