import React from "react";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const data = [
  {
    time: "00:00",
    high: 410,
    records: 4229,
    moving: 1805,
    stationary: 2424,
  },
  {
    time: "00:01",
    high: 381,
    records: 3849,
    moving: 1667,
    stationary: 2182,
  },
  {
    time: "00:02",
    high: 128,
    records: 1563,
    moving: 647,
    stationary: 916,
  },
  {
    time: "00:03",
    high: 38,
    records: 327,
    moving: 141,
    stationary: 186,
  },
  {
    time: "00:04",
    high: 4,
    records: 32,
    moving: 16,
    stationary: 16,
  },
];

function EscalationChart() {
  return (
    <div
      className="chart-container"
      style={{
        height: "350px",
        width: "100%",
        background: "#0b1f3a",
        borderRadius: "12px",
        padding: "15px",
        boxSizing: "border-box",
      }}
    >
      <h2
        style={{
          color: "#ffffff",
          margin: "0 0 8px",
          fontSize: "20px",
        }}
      >
        AIS High-Speed Activity Trend
      </h2>

      <p
        style={{
          color: "#b7c8df",
          margin: "0 0 5px",
          fontSize: "12px",
        }}
      >
        High-speed AIS records (SOG ≥ 10 knots)
      </p>

      <ResponsiveContainer width="100%" height="82%">
        <LineChart
          data={data}
          margin={{
            top: 20,
            right: 20,
            left: 10,
            bottom: 25,
          }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#1b3f70"
          />

          <XAxis
            dataKey="time"
            stroke="#b7c8df"
            tick={{ fill: "#b7c8df", fontSize: 12 }}
            label={{
              value: "Observation Time",
              position: "insideBottom",
              offset: -15,
              fill: "#b7c8df",
            }}
          />

          <YAxis
            stroke="#b7c8df"
            tick={{ fill: "#b7c8df", fontSize: 12 }}
            allowDecimals={false}
            label={{
              value: "High-Speed AIS Records",
              angle: -90,
              position: "insideLeft",
              fill: "#b7c8df",
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
              fontWeight: 700,
            }}
            itemStyle={{
              color: "#ffffff",
            }}
            formatter={(value, name) => {
              const labels = {
                high: "High-Speed Records",
              };

              return [
                value,
                labels[name] || name,
              ];
            }}
          />

          <Line
            type="monotone"
            dataKey="high"
            name="High-Speed Records"
            stroke="#4b94ff"
            strokeWidth={3}
            dot={{
              r: 5,
              fill: "#ffffff",
              stroke: "#4b94ff",
              strokeWidth: 2,
            }}
            activeDot={{
              r: 7,
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default EscalationChart;
