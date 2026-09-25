import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Tooltip,
  Legend,
  Cell
} from "recharts";

export default function IncidentTrendChartTask37() {

  const data = [
    {
      name: "Critical",
      value: 6
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
      value: 24
    }
  ];

  const COLORS = [
    "#dc2626", // Critical - Red
    "#f97316", // High - Orange
    "#eab308", // Medium - Yellow
    "#22c55e"  // Low - Green
  ];

  return (
    <div className="card">
      <h3>Incident Distribution</h3>

      <ResponsiveContainer
        width="100%"
        height={350}
      >
        <PieChart>

          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={120}
            label
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index]}
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