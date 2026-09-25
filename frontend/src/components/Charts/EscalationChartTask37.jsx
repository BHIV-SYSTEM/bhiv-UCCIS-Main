import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Tooltip
} from "recharts";

export default function EscalationChartTask37() {

  const data = [
    { name: "P1", value: 10 },
    { name: "P2", value: 20 },
    { name: "P3", value: 30 }
  ];

  return (
    <div className="chart-card">

      <h3>Escalations</h3>

      <ResponsiveContainer
        width="100%"
        height={300}
      >
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
          />
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>

    </div>
  );
}