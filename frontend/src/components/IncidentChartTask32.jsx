import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const IncidentChartTask32 = ({
  signals = 0,
  incidents = 0,
  escalations = 0,
}) => {
  const data = [
    { name: "Signals", value: Number(signals) || 130 },
    { name: "Incidents", value: Number(incidents) || 75 },
    { name: "Escalations", value: Number(escalations) || 42 },
  ];

  return (
    // 🔥 FIX 1: HARD HEIGHT CONTAINER
    <div style={{ width: "100%", height: 350, minHeight: 350 }}>

      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>

          <CartesianGrid strokeDasharray="3 3" />

          <XAxis
  dataKey="name"
  label={{
    value: "Signal Type",
    position: "insideBottom",
    offset: -1,
  }}
/>

<YAxis
  label={{
    value: "Signal Count",
    angle: -90,
    position: "insideLeft",
  }}
/>

          <Tooltip />

          <Bar dataKey="value" fill="#1890ff" />

        </BarChart>
      </ResponsiveContainer>

    </div>
  );
};

export default IncidentChartTask32;