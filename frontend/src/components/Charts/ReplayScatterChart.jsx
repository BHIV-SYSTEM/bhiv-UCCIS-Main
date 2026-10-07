import React from "react";

import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function ReplayScatterChart() {
  const data = [
    {
      x: -122.5,
      y: 47.5,
    },
    {
      x: -90.5,
      y: 29.5,
    },
    {
      x: -95.5,
      y: 29.5,
    },
    {
      x: -118.5,
      y: 33.5,
    },
    {
      x: -74.5,
      y: 40.5,
    },
    {
      x: -95.0,
      y: 29.0,
    },
    {
      x: -122.5,
      y: 37.5,
    },
    {
      x: -123.5,
      y: 49.0,
    },
    {
      x: -117.5,
      y: 32.5,
    },
    {
      x: -80.5,
      y: 25.5,
    },
  ];

  return (
    <ResponsiveContainer
      width="100%"
      height={260}
    >
      <ScatterChart
        margin={{
          top: 20,
          right: 20,
          left: 20,
          bottom: 40,
        }}
      >

        <XAxis
          dataKey="x"
          type="number"
          domain={[-160, -60]}
          label={{
            value: "Longitude",
            position: "insideBottom",
            offset: -20,
            fill: "#ffffff",
            fontSize: 14,
            fontWeight: "bold",
          }}
        />

        <YAxis
          dataKey="y"
          type="number"
          domain={[15, 50]}
          label={{
            value: "Latitude",
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
          formatter={(value, name) => [
            value,
            name === "x" ? "Longitude" : "Latitude",
          ]}
        />

        <Scatter
          data={data}
          fill="#22c55e"
        />

      </ScatterChart>
    </ResponsiveContainer>
  );
}
