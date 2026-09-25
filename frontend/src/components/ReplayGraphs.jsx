import React from "react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from "recharts";

export default function ReplayGraphs({ phase }) {

  const phaseGraphData = {

    final: [
      {
        name: "Replay",
        completed: 90,
        pending: 10
      },
      {
        name: "Recovery",
        completed: 95,
        pending: 5
      },
      {
        name: "Validation",
        completed: 98,
        pending: 2
      }
    ]

  };

  const fallback = [
    {
      name: "Activity-1",
      completed: 70,
      pending: 30
    },
    {
      name: "Activity-2",
      completed: 85,
      pending: 15
    },
    {
      name: "Activity-3",
      completed: 92,
      pending: 8
    }
  ];

  const data =
    phaseGraphData[phase] || fallback;

  return (
    <div
      style={{
        marginTop: "20px",
        background: "#111827",
        padding: "20px",
        borderRadius: "12px",
        height: "350px"
      }}
    >
      <h2>
        {phase.toUpperCase()} — Distributed Replay Activity
      </h2>

      <ResponsiveContainer width="100%" height="90%">

        <BarChart
          data={data}
          stackOffset="expand"
        >

          <XAxis dataKey="name" />

          <YAxis tickFormatter={(v) => `${v * 100}%`} />

          <Tooltip />

          <Legend />

          <Bar
            dataKey="completed"
            stackId="a"
            fill="#10b981"
          />

          <Bar
            dataKey="pending"
            stackId="a"
            fill="#ef4444"
          />

        </BarChart>

      </ResponsiveContainer>
    </div>
  );
}