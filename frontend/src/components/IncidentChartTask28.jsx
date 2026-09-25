import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Tooltip
} from "recharts";

export default function IncidentChartTask28() {

  const data = [
    { name: "Flood", value: 5 },
    { name: "Traffic", value: 4 },
    { name: "Medical", value: 3 },
    { name: "Power", value: 2 },
    { name: "Cyber", value: 1 }
  ];

  return (
    <div className="panel">
      <h2>Incident Distribution</h2>

      <ResponsiveContainer
        width="100%"
        height={350}
      >
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={120}
          />
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}