import React from "react";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function OperationalDonutChart() {
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
    "#38bdf8",
    "#22c55e",
  ];

  return (
    <ResponsiveContainer
      width="100%"
      height={240}
    >
      <PieChart>

        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={50}
          outerRadius={90}
          paddingAngle={4}
          dataKey="value"
          nameKey="name"
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
          wrapperStyle={{
            color: "#ffffff",
          }}
        />

      </PieChart>
    </ResponsiveContainer>
  );
}
