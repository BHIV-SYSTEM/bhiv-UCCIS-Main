import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function SignalChart() {

  const data = [
    { name: "Fire", value: 40 },
    { name: "Flood", value: 30 },
    { name: "Cyber", value: 20 },
    { name: "Medical", value: 25 }
  ];

  return (
    <div className="chart-card">

      <h2>Signals Analysis</h2>

      <ResponsiveContainer
        width="100%"
        height={300}
      >
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" 
            fill="#38bdf8"
          />
        </BarChart>
      </ResponsiveContainer>

    </div>
  );
}