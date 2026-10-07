import React from "react";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function FailurePieChart() {
  const data = [
    {
      name: "Stationary",
      value: 5724,
    },
    {
      name: "Moving",
      value: 4276,
    },
  ];

  const COLORS = [
    "#22c55e",
    "#38bdf8",
  ];

  return (
    <ResponsiveContainer
      width="100%"
      height={250}
    >
      <PieChart>

        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="45%"
          outerRadius={70}
          label
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[index]}
            />
          ))}
        </Pie>

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

        <Legend
          verticalAlign="bottom"
          align="center"
          iconType="circle"
          wrapperStyle={{
            color: "#ffffff",
            fontSize: "13px",
            fontWeight: "600",
          }}
        />

      </PieChart>
    </ResponsiveContainer>
  );
}
