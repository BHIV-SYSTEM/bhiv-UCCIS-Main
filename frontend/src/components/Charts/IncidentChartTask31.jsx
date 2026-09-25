import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const IncidentChartTask31 = ({ incidents }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={incidents}>
        <XAxis dataKey="severity" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="count" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default IncidentChartTask31;