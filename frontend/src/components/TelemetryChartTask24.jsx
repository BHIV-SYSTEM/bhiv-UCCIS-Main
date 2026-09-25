import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const data = [
  { name: "T1", value: 20 },
  { name: "T2", value: 45 },
  { name: "T3", value: 30 },
  { name: "T4", value: 70 },
  { name: "T5", value: 55 },
  { name: "T6", value: 82 },
];

export default function TelemetryChartTask24() {
  return (
    <div style={{ width: "100%", height: 360 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 30,
            right: 25,
            left: 10,
            bottom: 10,
          }}
        >
          <CartesianGrid
            stroke="#d1d5db"
            strokeDasharray="4 4"
            horizontal={true}
            vertical={true}
          />

          <XAxis
            dataKey="name"
            tick={{
              fill: "#6b7280",
              fontSize: 18,
            }}
            tickLine={false}
            axisLine={{
              stroke: "#6b7280",
              strokeWidth: 1.5,
            }}
            label={{
    value: "Time",
    position: "insideBottom",
    offset: -5,
    fill: "#6b7280",
    fontSize: 16,
  }}
          />

          <YAxis
            domain={[0, 85]}
            ticks={[0, 20, 40, 60, 80]}
            tick={{
              fill: "#6b7280",
              fontSize: 18,
            }}
            tickLine={false}
            axisLine={{
              stroke: "#6b7280",
              strokeWidth: 1.5,
            }}
            label={{
    value: "Signal Activity",
    angle: -90,
    position: "insideLeft",
    offset: 10,
    fill: "#6b7280",
    fontSize: 16,
  }}
          />

          <Tooltip
            contentStyle={{
              background: "#111827",
              border: "1px solid #334155",
              borderRadius: 8,
              color: "#fff",
            }}
            cursor={{
              stroke: "#14d8ff",
              strokeWidth: 1,
            }}
          />

          <Line
            type="monotone"
            dataKey="value"
            stroke="#12d8ff"
            strokeWidth={4}
            isAnimationActive={false}
            dot={{
              r: 6,
              fill: "#ffffff",
              stroke: "#12d8ff",
              strokeWidth: 4,
            }}
            activeDot={{
              r: 8,
              fill: "#ffffff",
              stroke: "#12d8ff",
              strokeWidth: 4,
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}