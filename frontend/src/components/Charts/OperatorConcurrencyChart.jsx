import React from "react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function OperatorConcurrencyChart() {
  const data = [
    {
      time: "00:00",
      moving: 1805,
      stationary: 2424,
    },
    {
      time: "00:01",
      moving: 1667,
      stationary: 2182,
    },
    {
      time: "00:02",
      moving: 647,
      stationary: 916,
    },
    {
      time: "00:03",
      moving: 141,
      stationary: 186,
    },
    {
      time: "00:04",
      moving: 16,
      stationary: 16,
    },
  ];

  return (
    <ResponsiveContainer
      width="100%"
      height={260}
    >
      <BarChart
        data={data}
        margin={{
          top: 20,
          right: 20,
          left: 20,
          bottom: 10,
        }}
      >

        <XAxis
          dataKey="time"
          label={{
            value: "AIS Time",
            position: "insideBottom",
            offset: -20,
            fill: "#ffffff",
            fontSize: 14,
            fontWeight: "bold",
          }}
        />

        <YAxis
          label={{
            value: "Activity Count",
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

        <Legend />

        <Bar
          dataKey="moving"
          name="Moving Vessels"
          fill="#38bdf8"
          radius={[5, 5, 0, 0]}
        />

        <Bar
          dataKey="stationary"
          name="Stationary Vessels"
          fill="#f59e0b"
          radius={[5, 5, 0, 0]}
        />

      </BarChart>
    </ResponsiveContainer>
  );
}
