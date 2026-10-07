import React from "react";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

/*
 * AIS_file.csv
 *
 * Total AIS records: 10,000
 * Unique vessel types: 57
 *
 * Top VesselType values:
 * 31 -> 3,394
 * 37 -> 1,641
 * 60 ->   954
 * 70 ->   849
 *
 * Remaining vessel types -> 3,162
 */

const data = [
  {
    name: "Vessel Type 31",
    value: 3394,
  },
  {
    name: "Vessel Type 37",
    value: 1641,
  },
  {
    name: "Vessel Type 60",
    value: 954,
  },
  {
    name: "Vessel Type 70",
    value: 849,
  },
  {
    name: "Other Vessel Types",
    value: 3162,
  },
];

const COLORS = [
  "#ff4d57",
  "#ffb400",
  "#52c41a",
  "#2979ff",
  "#8b5cf6",
];

function DomainPieChart() {
  return (
    <div className="chart-container">

      {/* Chart Title */}
      <h2>
        AIS Vessel Type Distribution
      </h2>

      <ResponsiveContainer
        width="100%"
        height={280}
      >

        <PieChart>

          {/* Pie */}
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            innerRadius={0}
            paddingAngle={2}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>

          {/* Tooltip */}
          <Tooltip
            contentStyle={{
              background: "#102e56",
              border: "1px solid #1b3f70",
              borderRadius: "10px",
            }}
            labelStyle={{
              color: "#ffffff",
            }}
            itemStyle={{
              color: "#ffffff",
            }}
            formatter={(value, name) => [
              `${value.toLocaleString()} records`,
              name,
            ]}
          />

          {/* Legend */}
          <Legend
            wrapperStyle={{
              color: "#b7c8df",
            }}
          />

        </PieChart>

      </ResponsiveContainer>

    </div>
  );
}

export default DomainPieChart;
