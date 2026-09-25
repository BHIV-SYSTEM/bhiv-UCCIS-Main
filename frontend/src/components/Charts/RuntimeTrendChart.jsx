import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell
} from "recharts";

function RuntimeTrendChart() {
  const data = [
    {
      day: "Mon",
      health: 92
    },
    {
      day: "Tue",
      health: 95
    },
    {
      day: "Wed",
      health: 97
    },
    {
      day: "Thu",
      health: 94
    },
    {
      day: "Fri",
      health: 98
    },
    {
      day: "Sat",
      health: 96
    },
    {
      day: "Sun",
      health: 99
    }
  ];

  const colors = [
    "#3b82f6",
    "#06b6d4",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#14b8a6"
  ];

  return (
    <div className="panel">
      <h2>Runtime Health Trend</h2>

      <ResponsiveContainer
        width="100%"
        height={320}
      >
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 20,
            left: 0,
            bottom: 5
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis
  dataKey="day"
  label={{
    value: "Day",
    position: "insideBottom",
    offset: -5,
  }}
/>

<YAxis
  domain={[80, 100]}
  label={{
    value: "Health Score",
    angle: -90,
    position: "insideLeft",
  }}
/>

          <Tooltip />

          <Bar
            dataKey="health"
            radius={[8, 8, 0, 0]}
          >
            {data.map(
              (entry, index) => (
                <Cell
                  key={index}
                  fill={colors[index]}
                />
              )
            )}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div
        style={{
          marginTop: "15px",
          display: "flex",
          justifyContent: "space-around",
          fontWeight: "600"
        }}
      >
        <span>Average: 96%</span>
        <span>Peak: 99%</span>
        <span>Lowest: 92%</span>
      </div>
    </div>
  );
}

export default RuntimeTrendChart;