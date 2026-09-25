import {
  PieChart,
  Pie,
  Tooltip
} from "recharts";

const data = [
  { name: "Flood", value: 8 },
  { name: "Traffic", value: 10 },
  { name: "Water", value: 6 }
];

const SignalDistributionChart = () => {
  return (
    <div className="chart-container">
      <h3>Signal Distribution</h3>

      <PieChart width={400} height={300}>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
        />
        <Tooltip />
      </PieChart>
    </div>
  );
};

export default SignalDistributionChart;