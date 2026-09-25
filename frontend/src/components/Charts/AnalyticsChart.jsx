import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip
} from "recharts";

export default function AnalyticsChart() {

  const data = [
    {
      module: "Signals",
      count: 450
    },
    {
      module: "Incidents",
      count: 120
    },
    {
      module: "Replay",
      count: 280
    },
    {
      module: "Evidence",
      count: 150
    }
  ];

  return (
    <div className="chart-card">

      <h3>Analytics</h3>

      <ResponsiveContainer
        width="100%"
        height={300}
      >
        <BarChart data={data}>
          <XAxis dataKey="module" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" />
        </BarChart>
      </ResponsiveContainer>

    </div>
  );
}