import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

function IncidentChartTask36() {
  const data = [
    {
      name: "Critical",
      value: 8
    },
    {
      name: "High",
      value: 12
    },
    {
      name: "Medium",
      value: 18
    },
    {
      name: "Low",
      value: 9
    }
  ];

  const COLORS = [
    "#dc2626", // Critical - Red
    "#ea580c", // High - Orange
    "#eab308", // Medium - Yellow
    "#16a34a"  // Low - Green
  ];

  return (
    <div className="panel">
      <h2>Incident Distribution</h2>

      <ResponsiveContainer
        width="100%"
        height={320}
      >
        <PieChart>

          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={100}
            innerRadius={50}
            paddingAngle={4}
            dataKey="value"
            label
          >
            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={COLORS[index]}
              />
            ))}
          </Pie>

          <Tooltip />

          <Legend
            verticalAlign="bottom"
            height={36}
          />

        </PieChart>
      </ResponsiveContainer>

      <div
        style={{
          marginTop: "15px",
          display: "flex",
          justifyContent: "space-around",
          fontWeight: "600"
        }}
      >
        <span style={{ color: "#dc2626" }}>
          Critical: 8
        </span>

        <span style={{ color: "#ea580c" }}>
          High: 12
        </span>

        <span style={{ color: "#eab308" }}>
          Medium: 18
        </span>

        <span style={{ color: "#16a34a" }}>
          Low: 9
        </span>
      </div>
    </div>
  );
}

export default IncidentChartTask36;