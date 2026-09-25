import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

function TelemetryTrendChart() {

  const data = [
    { hour: "09", events: 6200 },
    { hour: "10", events: 7100 },
    { hour: "11", events: 7420 },
    { hour: "12", events: 6900 },
    { hour: "13", events: 7800 },
    { hour: "14", events: 8200 }
  ];

  return (
    <div className="panel">

      <h2>Telemetry Trend</h2>

      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
  dataKey="hour"
  label={{
    value: "Hour",
    position: "insideBottom",
    offset: -1,
  }}
/>

<YAxis
  label={{
    value: "Telemetry Count",
    angle: -90,
    position: "insideLeft",
  }}
/>
          <Tooltip />
          <Bar dataKey="events" fill="#2563eb" />
        </BarChart>
      </ResponsiveContainer>

    </div>
  );
}

export default TelemetryTrendChart;