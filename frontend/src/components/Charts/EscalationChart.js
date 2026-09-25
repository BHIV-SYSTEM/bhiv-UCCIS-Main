import React from "react";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

const data = [
  { time: "12 PM", high: 2 },
  { time: "2 PM", high: 3 },
  { time: "4 PM", high: 2 },
  { time: "6 PM", high: 4 },
  { time: "8 PM", high: 3 }
];

function EscalationChart() {
  return (
    <div className="chart-container" style={{ height: "350px" }}>
      <h2>Escalation Trend</h2>

      <ResponsiveContainer width="200%" height="90%">
        <LineChart
          data={data}
          margin={{
            top: 20,
            right: 20,
            left: 0,
            bottom: 10
          }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#1b3f70"
          />

          <XAxis
  dataKey="time"
  stroke="#b7c8df"
  tick={{ fill: "#b7c8df" }}
  label={{
    value: "Time",
    position: "insideBottom",
    offset: -5,
    fill: "#b7c8df",
  }}
/>

<YAxis
  stroke="#b7c8df"
  tick={{ fill: "#b7c8df" }}
  label={{
    value: "Escalation Count",
    angle: -90,
    position: "outsideLeft",
    fill: "#b7c8df",
  }}
/>

          <Tooltip
            contentStyle={{
              background: "#102e56",
              border: "1px solid #1b3f70",
              borderRadius: "10px"
            }}
            labelStyle={{ color: "#ffffff" }}
            itemStyle={{ color: "#ffffff" }}
          />

          <Line
            type="monotone"
            dataKey="high"
            stroke="#4b94ff"
            strokeWidth={3}
            dot={{ r: 5, fill: "#ffffff" }}
            activeDot={{ r: 7 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default EscalationChart;