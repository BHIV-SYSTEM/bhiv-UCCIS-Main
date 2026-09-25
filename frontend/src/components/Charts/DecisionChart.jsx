import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const data = [
  { name: "Rescue", value: 12 },
  { name: "Medical", value: 8 },
  { name: "Traffic", value: 5 },
  { name: "Power", value: 3 }
];

const DecisionChart = () => {
  return (
    <div className="card">

      <h2>Decision Analytics</h2>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Area dataKey="value" />
        </AreaChart>
      </ResponsiveContainer>

    </div>
  );
};

export default DecisionChart;