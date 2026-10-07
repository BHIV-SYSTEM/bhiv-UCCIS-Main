import React from "react";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function FailureStackedChart() {
  const data = [
    {
      time: "00:00",
      stationary: 2424,
      moving: 1805,
    },
    {
      time: "00:01",
      stationary: 2182,
      moving: 1667,
    },
    {
      time: "00:02",
      stationary: 916,
      moving: 647,
    },
    {
      time: "00:03",
      stationary: 186,
      moving: 141,
    },
    {
      time: "00:04",
      stationary: 16,
      moving: 16,
    },
  ];

  return (
    <ResponsiveContainer
      width="100%"
      height={260}
    >
      <AreaChart
        data={data}
        margin={{
          top: 20,
          right: 20,
          left: 20,
          bottom: 40,
        }}
      >

        <XAxis
          dataKey="time"
          label={{
            value: "AIS Timeline",
            position: "insideBottom",
            offset: -20,
            fill: "#ffffff",
            fontSize: 14,
            fontWeight: "bold",
          }}
        />

        <YAxis
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
          labelFormatter={(label) => `Time: ${label}`}
        />

        <Area
          type="monotone"
          dataKey="stationary"
          name="Stationary"
          stackId="1"
          stroke="#ef4444"
          fill="#ef4444"
        />

        <Area
          type="monotone"
          dataKey="moving"
          name="Moving"
          stackId="1"
          stroke="#22c55e"
          fill="#22c55e"
        />

      </AreaChart>
    </ResponsiveContainer>
  );
}
