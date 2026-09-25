import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const data = [
  { day: "Mon", alerts: 5 },
  { day: "Tue", alerts: 7 },
  { day: "Wed", alerts: 13 },
  { day: "Thu", alerts: 10 },
  { day: "Fri", alerts: 6 },
  { day: "Sat", alerts: 9 },
  { day: "Sun", alerts: 11 }
];

function OperationalTrend() {
  return (
    <div className="panel">

      <h2>Operational Trend</h2>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>

          <XAxis dataKey="day" />

          <YAxis />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="alerts"
            stroke="#3b82f6"
            strokeWidth={3}
          />

        </LineChart>
      </ResponsiveContainer>

    </div>
  );
}

export default OperationalTrend;