import React from "react";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend
} from "recharts";

export default function ReplayPieChart({ phase }) {

  const phasePieData = {

    replay: [
      { name: "Signal", value: 40 },
      { name: "Escalation", value: 35 },
      { name: "Validation", value: 25 }
    ],

    concurrency: [
      { name: "Operators", value: 45 },
      { name: "Collisions", value: 30 },
      { name: "Reconciliation", value: 25 }
    ],

    corruption: [
      { name: "Corrupted", value: 30 },
      { name: "Recovered", value: 50 },
      { name: "Pending", value: 20 }
    ],

    lineage: [
      { name: "Append-only", value: 50 },
      { name: "Immutable", value: 30 },
      { name: "Validated", value: 20 }
    ],

    enforcement: [
      { name: "Governance", value: 40 },
      { name: "Visibility", value: 35 },
      { name: "Continuity", value: 25 }
    ],

    field: [
      { name: "Assignments", value: 50 },
      { name: "Acknowledged", value: 30 },
      { name: "Escalated", value: 20 }
    ],

    stability: [
      { name: "Telemetry", value: 45 },
      { name: "Consistency", value: 35 },
      { name: "Latency", value: 20 }
    ],

    governance: [
      { name: "Replay UX", value: 50 },
      { name: "Timeline", value: 30 },
      { name: "Visibility", value: 20 }
    ],

    failure: [
      { name: "Warnings", value: 40 },
      { name: "Recovery", value: 35 },
      { name: "Corruption", value: 25 }
    ],

    final: [
      { name: "Replay", value: 40 },
      { name: "Recovery", value: 35 },
      { name: "Validation", value: 25 }
    ]

  };

  const COLORS = [
    "#3b82f6",
    "#10b981",
    "#ef4444",
    "#f59e0b",
    "#8b5cf6"
  ];

  const data = phasePieData[phase] || [];

  return (
    <div
      style={{
        marginTop: "20px",
        background: "#111827",
        padding: "20px",
        borderRadius: "12px",
        height: "420px"
      }}
    >
      <h2>
        {phase.toUpperCase()} — Operational Distribution
      </h2>

      <ResponsiveContainer width="100%" height="90%">

        <PieChart>

          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={120}
            label
          >

            {data.map((entry, index) => (

              <Cell
                key={index}
                fill={
                  COLORS[index % COLORS.length]
                }
              />

            ))}

          </Pie>

          <Tooltip />

          <Legend />

        </PieChart>

      </ResponsiveContainer>
    </div>
  );
}