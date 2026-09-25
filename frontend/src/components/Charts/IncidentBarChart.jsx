import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const data = [
  { district: "Mumbai", incidents: 44 },
  { district: "Pune", incidents: 31 },
  { district: "Nashik", incidents: 18 },
  { district: "Nagpur", incidents: 27 }
];

export default function IncidentBarChart() {

  return (
    <div className="chart-box">

      <div className="chart-title">
        INCIDENT LOAD
      </div>

      <ResponsiveContainer width="100%" height={250}>

        <BarChart data={data}>

          <XAxis dataKey="district" />

          <YAxis />

          <Tooltip />

          <Bar dataKey="incidents" fill="#3b82f6" />

        </BarChart>

      </ResponsiveContainer>

    </div>
  );
}