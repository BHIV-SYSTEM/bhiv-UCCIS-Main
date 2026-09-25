import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const data = [
  { time: "08:00", replay: 12 },
  { time: "09:00", replay: 18 },
  { time: "10:00", replay: 24 },
  { time: "11:00", replay: 17 }
];

export default function ReplayLineChartTask14() {

  return (
    <div className="chart-box">

      <div className="chart-title">
        REPLAY ACTIVITY
      </div>

      <ResponsiveContainer width="100%" height={250}>

        <LineChart data={data}>

          <XAxis dataKey="time" />

          <YAxis />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="replay"
            stroke="#00d084"
            strokeWidth={3}
          />

        </LineChart>

      </ResponsiveContainer>

    </div>
  );
}