import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";

const data = [
  { level: "L1", value: 40 },
  { level: "L2", value: 25 },
  { level: "L3", value: 10 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: "#fff",
          border: "1px solid #ddd",
          padding: "12px 14px",
          borderRadius: "2px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
        }}
      >
        <div
          style={{
            color: "#c7ccd8",
            fontSize: 16,
            marginBottom: 8,
          }}
        >
          {label}
        </div>

        <div
          style={{
            color: "#79d29b",
            fontSize: 18,
            fontWeight: 600,
          }}
        >
          value : {payload[0].value}
        </div>
      </div>
    );
  }

  return null;
};

export default function EscalationChartTask38() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data}
        margin={{
          top: 10,
          right: 20,
          left: 0,
          bottom: 0,
        }}
      >
        <XAxis
  dataKey="level"
  tick={{
    fill: "#6f7488",
    fontSize: 16,
  }}
  axisLine={{
    stroke: "#50556d",
  }}
  tickLine={false}
  label={{
    value: "Escalation Level",
    position: "insideBottom",
    offset: -1,
    fill: "#6f7488",
    fontSize: 14,
  }}
/>

<YAxis
  domain={[0, 40]}
  ticks={[0, 10, 20, 30, 40]}
  tick={{
    fill: "#6f7488",
    fontSize: 16,
  }}
  axisLine={{
    stroke: "#50556d",
  }}
  tickLine={false}
  label={{
    value: "Escalation Count",
    angle: -90,
    position: "insideLeft",
    fill: "#6f7488",
    fontSize: 14,
  }}
/>

        <Tooltip
          cursor={{ fill: "rgba(255,255,255,0.12)" }}
          content={<CustomTooltip />}
        />

        <Bar
          dataKey="value"
          radius={[0, 0, 0, 0]}
          barSize={170}
        >
          {data.map((entry, index) => (
            <Cell
              key={index}
              fill="#82c99a"
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}