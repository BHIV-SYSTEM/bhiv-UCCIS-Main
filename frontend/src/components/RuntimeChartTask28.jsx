import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip
} from "recharts";

export default function RuntimeChartTask28() {

  const data = [
    { day: "Mon", signals: 4 },
    { day: "Tue", signals: 7 },
    { day: "Wed", signals: 5 },
    { day: "Thu", signals: 10 },
    { day: "Fri", signals: 13 }
  ];

  return (
    <div className="panel">
      <h2>Runtime Activity</h2>

      <ResponsiveContainer
        width="100%"
        height={350}
      >
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />

          <Bar
            type="monotone"
            dataKey="signals"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}