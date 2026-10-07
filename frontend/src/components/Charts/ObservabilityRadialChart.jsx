import React from "react";

import {
  RadialBarChart,
  RadialBar,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function ObservabilityRadialChart() {
  /*
   * AIS_file.csv metrics
   *
   * Total records: 10,000
   * AIS data quality: 99.77%
   *
   * The radial chart represents the quality /
   * observability of the AIS dataset.
   */

  const data = [
    {
      name: "AIS Data Quality",
      value: 99.77,
      fill: "#38bdf8",
    },
  ];

  return (
    <ResponsiveContainer
      width="100%"
      height={220}
    >
      <RadialBarChart
        innerRadius="70%"
        outerRadius="100%"
        data={data}
        startAngle={180}
        endAngle={0}
      >

        <RadialBar
          minAngle={15}
          dataKey="value"
          background
          clockWise
        />

        <Legend
          iconSize={10}
          layout="horizontal"
          verticalAlign="bottom"
          align="center"
          formatter={(value) => (
            <span
              style={{
                color: "#b7c8df",
                fontSize: "12px",
              }}
            >
              {value}
            </span>
          )}
        />

      </RadialBarChart>
    </ResponsiveContainer>
  );
}
