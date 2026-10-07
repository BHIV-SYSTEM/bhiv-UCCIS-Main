import React from "react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function RecoveryLineChart() {
  const data = [
    {
      recovery: "00:00",
      continuity: 4229,
    },
    {
      recovery: "00:01",
      continuity: 3849,
    },
    {
      recovery: "00:02",
      continuity: 1563,
    },
    {
      recovery: "00:03",
      continuity: 327,
    },
    {
      recovery: "00:04",
      continuity: 32,
    },
  ];

  return (
    <ResponsiveContainer
      width="100%"
      height={260}
    >
      <LineChart
        data={data}
        margin={{
          top: 20,
          right: 20,
          left: 20,
          bottom: 40,
        }}
      >

        <XAxis
          dataKey="recovery"
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
            value: "AIS Record Count",
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

        <Line
          type="monotone"
          dataKey="continuity"
          name="AIS Activity"
          stroke="#22c55e"
          strokeWidth={3}
          dot={{
            r: 5,
          }}
          activeDot={{
            r: 7,
          }}
        />

      </LineChart>
    </ResponsiveContainer>
  );
}
