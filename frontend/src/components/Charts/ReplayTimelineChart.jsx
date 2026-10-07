import React from "react";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function ReplayTimelineChart() {
  /*
   * AIS_file.csv
   *
   * Total AIS records: 10,000
   *
   * AIS record distribution by minute:
   *
   * 00:00 -> 4,229
   * 00:01 -> 3,849
   * 00:02 -> 1,563
   * 00:03 ->   327
   * 00:04 ->    32
   *
   * The chart represents the AIS observation/replay timeline.
   */

  const data = [
    {
      time: "00:00",
      events: 4229,
    },
    {
      time: "00:01",
      events: 3849,
    },
    {
      time: "00:02",
      events: 1563,
    },
    {
      time: "00:03",
      events: 327,
    },
    {
      time: "00:04",
      events: 32,
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
          top: 15,
          right: 20,
          left: 20,
          bottom: 35,
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
            value: "AIS Record Count",
            angle: -90,
            position: "insideLeft",
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
          dataKey="events"
          stroke="#38bdf8"
          fill="#38bdf8"
          fillOpacity={0.4}
        />

      </AreaChart>
    </ResponsiveContainer>
  );
}
