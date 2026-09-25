import {
  PieChart,
  Pie,
  Tooltip
} from "recharts";

export default function IncidentPie() {

  const data = [
    { name: "Low", value: 12 },
    { name: "Medium", value: 8 },
    { name: "High", value: 5 }
  ];

  return (
    <PieChart width={350} height={300}>
      <Pie
        data={data}
        dataKey="value"
        outerRadius={100}
      />
      <Tooltip />
    </PieChart>
  );
}