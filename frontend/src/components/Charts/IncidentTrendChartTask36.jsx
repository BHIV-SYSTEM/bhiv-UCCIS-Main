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

function IncidentTrendChartTask36() {

  const data = [
    { day: "Mon", incidents: 8 },
    { day: "Tue", incidents: 12 },
    { day: "Wed", incidents: 10 },
    { day: "Thu", incidents: 15 },
    { day: "Fri", incidents: 18 },
    { day: "Sat", incidents: 9 },
    { day: "Sun", incidents: 4 }
  ];

  const colors = [
    "#2563eb",
    "#16a34a",
    "#ca8a04",
    "#dc2626",
    "#7c3aed",
    "#0891b2",
    "#0f766e"
  ];

  return (
    <div className="panel">

      <h2>Incident Trend</h2>

      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
  dataKey="day"
  label={{
    value: "Day",
    position: "insideBottom",
    offset: -1,
  }}
/>

<YAxis
  label={{
    value: "Incident Count",
    angle: -90,
    position: "insideLeft",
  }}
/>
          <Tooltip />

          <Bar dataKey="incidents" radius={[8, 8, 0, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={colors[index]}
              />
            ))}
          </Bar>

        </BarChart>
      </ResponsiveContainer>

    </div>
  );
}

export default IncidentTrendChartTask36;