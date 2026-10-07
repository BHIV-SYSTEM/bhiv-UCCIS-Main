import React from "react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

export default function EnforcementBarChart() {
  const data = [
    {
      stage: "Vessel Type 31",
      value: 3394,
    },
    {
      stage: "Vessel Type 37",
      value: 1641,
    },
    {
      stage: "Vessel Type 60",
      value: 954,
    },
    {
      stage: "Vessel Type 70",
      value: 849,
    },
    {
      stage: "Vessel Type 90",
      value: 677,
    },
  ];

  const colors = [
    "#38bdf8",
    "#22c55e",
    "#f59e0b",
    "#ef4444",
    "#a855f7",
  ];

  return (
    <ResponsiveContainer
      width="100%"
      height={270}
    >
      <BarChart
        data={data}
        margin={{
          top: 20,
          right: 20,
          left: 20,
          bottom: 50,
        }}
      >

        <XAxis
          dataKey="stage"
          interval={0}
          tick={{
            fill: "#cbd5e1",
            fontSize: 12,
          }}
          axisLine={{
            stroke: "#475569",
          }}
          tickLine={false}
          label={{
            value: "AIS Vessel Type",
            position: "insideBottom",
            offset: -25,
            fill: "#ffffff",
            fontSize: 14,
            fontWeight: "bold",
          }}
        />

        <YAxis
          tick={{
            fill: "#cbd5e1",
            fontSize: 12,
          }}
          axisLine={{
            stroke: "#475569",
          }}
          tickLine={false}
          label={{
            value: "Record Count",
            angle: -90,
            position: "outsideLeft",
            fill: "#ffffff",
            fontSize: 14,
            fontWeight: "bold",
          }}
        />

        <Tooltip
          contentStyle={{
            background: "#102e56",
            border: "1px solid #1b3f70",
            borderRadius: "10px",
            color: "#ffffff",
          }}
          labelStyle={{
            color: "#ffffff",
          }}
          itemStyle={{
            color: "#ffffff",
          }}
          formatter={(value) => [
            `${Number(value).toLocaleString()} records`,
            "AIS Activity",
          ]}
        />

        <Bar
          dataKey="value"
          name="AIS Record Count"
          radius={[6, 6, 0, 0]}
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={colors[index % colors.length]}
            />
          ))}
        </Bar>

      </BarChart>
    </ResponsiveContainer>
  );
}
