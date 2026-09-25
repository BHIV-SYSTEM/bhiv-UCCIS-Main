import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const data = [
  { name: "High", value: 6 },
  { name: "Medium", value: 11 },
  { name: "Low", value: 18 }
];

const COLORS = ["#ef4444", "#f59e0b", "#00d084"];

export default function DistrictStressChart() {

  return (
    <div className="chart-box">

      <div className="chart-title">
        DISTRICT STRESS
      </div>

      <ResponsiveContainer width="100%" height={260}>

        <PieChart>

          <Pie
            data={data}
            dataKey="value"
            outerRadius={90}
          >

            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={COLORS[index]}
              />
            ))}

          </Pie>

          <Tooltip />

        </PieChart>

      </ResponsiveContainer>

    </div>
  );
}