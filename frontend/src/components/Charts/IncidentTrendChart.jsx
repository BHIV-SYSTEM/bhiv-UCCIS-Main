import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const data = [
  { day: "Mon", incidents: 4 },
  { day: "Tue", incidents: 7 },
  { day: "Wed", incidents: 5 },
  { day: "Thu", incidents: 9 },
  { day: "Fri", incidents: 12 },
  { day: "Sat", incidents: 8 },
  { day: "Sun", incidents: 6 }
];

const IncidentTrendChart = () => {
  return (
    <div className="chart-container">
      <h3>Incident Trend</h3>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="incidents"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default IncidentTrendChart;