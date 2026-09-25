import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip
} from "recharts";

export default function ReplayMetricsChart() {

  const data = [
    {
      run: "R1",
      time: 120
    },
    {
      run: "R2",
      time: 220
    },
    {
      run: "R3",
      time: 180
    },
    {
      run: "R4",
      time: 300
    }
  ];

  return (
    <div className="chart-card">

      <h3>Replay Metrics</h3>

      <ResponsiveContainer
        width="100%"
        height={300}
      >
        <AreaChart data={data}>
          <XAxis dataKey="run" />
          <YAxis />
          <Tooltip />
          <Area dataKey="time" />
        </AreaChart>
      </ResponsiveContainer>

    </div>
  );
}