import React from "react";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

const data = [
  {
    name: "Flooding",
    value: 170
  },
  {
    name: "Traffic",
    value: 80
  },
  {
    name: "Waste",
    value: 30
  },
  {
    name: "Complaints",
    value: 20
  }
];

const COLORS = [
  "#ff4d57", // Flooding - matches "high" red
  "#ffb400", // Traffic - matches "moderate" amber
  "#52c41a", // Waste - matches "low" green
  "#2979ff"  // Complaints - matches accent blue
];

function DomainPieChart() {

  return (

    <div className="chart-container">

      <h2>
        Domain Priority
      </h2>

      <ResponsiveContainer
        width="100%"
        height={280}
      >

        <PieChart>

          <Pie
            data={data}
            dataKey="value"
            outerRadius={100}
          >
            {
              data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))
            }
          </Pie>

          <Tooltip
            contentStyle={{
              background: "#102e56",
              border: "1px solid #1b3f70",
              borderRadius: "10px"
            }}
            labelStyle={{ color: "#ffffff" }}
            itemStyle={{ color: "#ffffff" }}
          />

          <Legend
            wrapperStyle={{ color: "#b7c8df" }}
          />

        </PieChart>

      </ResponsiveContainer>

    </div>
  );
}

export default DomainPieChart;