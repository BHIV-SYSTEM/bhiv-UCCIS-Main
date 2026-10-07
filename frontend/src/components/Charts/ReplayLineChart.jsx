import React from "react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function ReplayLineChart() {
  const data = [
    {
      name: "00:00",
      replay: 4229,
    },
    {
      name: "00:01",
      replay: 3849,
    },
    {
      name: "00:02",
      replay: 1563,
    },
    {
      name: "00:03",
      replay: 327,
    },
    {
      name: "00:04",
      replay: 32,
    },
  ];

  return (
    <ResponsiveContainer
      width="100%"
      height={250}
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
          dataKey="name"
          label={{
            value: "AIS Time",
            position: "insideBottom",
            offset: -15,
          }}
        />

        <YAxis
          label={{
            value: "AIS Records",
            angle: -90,
            position: "outsideRight",
          }}
        />

        <Tooltip
          formatter={(value) => [
            `${Number(value).toLocaleString()} records`,
            "AIS Activity",
          ]}
          labelFormatter={(label) => `Time: ${label}`}
        />

        <Line
          type="monotone"
          dataKey="replay"
          stroke="#38bdf8"
          strokeWidth={3}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
        />

      </LineChart>
    </ResponsiveContainer>
  );
}
