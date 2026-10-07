import React from "react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function LifecycleBarChart() {
  /*
   * AIS_file.csv
   *
   * Total AIS records: 10,000
   *
   * Stationary records: 5,724
   * Moving records:     4,276
   * AIS unavailable:       23
   *
   * SOG = 0       -> Stationary
   * SOG > 0       -> Moving
   * SOG = 102.3   -> AIS unavailable / sentinel value
   */

  const data = [
    {
      phase: "Stationary",
      value: 5724,
    },
    {
      phase: "Moving",
      value: 4276,
    },
    {
      phase: "AIS Unavailable",
      value: 23,
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
          bottom: 40,
        }}
      >

        <XAxis
          dataKey="phase"
          label={{
            value: "AIS Activity State",
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
            fontSize: 12,
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
          fill="#22c55e"
          radius={[6, 6, 0, 0]}
        />

      </BarChart>
    </ResponsiveContainer>
  );
}
