import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const data = [
  { day: "Mon", alerts: 4 },
  { day: "Tue", alerts: 7 },
  { day: "Wed", alerts: 10 },
  { day: "Thu", alerts: 6 },
  { day: "Fri", alerts: 9 }
];

function OperationalTrend() {
  return (
    <div className="chart-box">
      <h2>Operational Trend</h2>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="alerts" fill="#38bdf8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default OperationalTrend;