import {
  RadialBarChart,
  RadialBar,
  Legend,
  ResponsiveContainer
} from "recharts";

export default function
ObservabilityRadialChart() {

  const data = [
    {
      name: "Health",
      value: 96,
      fill: "#38bdf8"
    }
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
        />

        <Legend />

      </RadialBarChart>
    </ResponsiveContainer>
  );
}