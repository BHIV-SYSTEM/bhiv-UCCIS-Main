import { LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";

export default function RiskChart({ logs }) {
  return (
    <div className="chart">
      <h3>Risk Trend</h3>

      <LineChart width={500} height={250} data={logs}>
        <XAxis dataKey="timestamp" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="risk_score" stroke="#ff4d4d" />
      </LineChart>
    </div>
  );
}