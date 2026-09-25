import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const data = [
  { phase: "Signals", total: 24 },
  { phase: "Telemetry", total: 24 },
  { phase: "Incidents", total: 18 },
  { phase: "Escalations", total: 12 },
  { phase: "Replay", total: 8 }
];

const RuntimeActivityChart = () => {
  return (
    <div className="chart-container">
      <h3>Runtime Activity</h3>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="phase" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="total" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RuntimeActivityChart;