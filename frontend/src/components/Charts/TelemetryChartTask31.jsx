import {
  PieChart,
  Pie,
  Tooltip
} from "recharts";

const TelemetryChartTask31 = ({ data }) => {
  return (
    <PieChart width={400} height={300}>
      <Pie
        data={data}
        dataKey="value"
        nameKey="name"
      />
      <Tooltip />
    </PieChart>
  );
};

export default TelemetryChartTask31;