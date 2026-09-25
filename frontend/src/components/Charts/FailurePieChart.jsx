import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

export default function FailurePieChart() {

  const data = [
    {
      name: "Recovered",
      value: 80
    },

    {
      name: "Pending",
      value: 20
    }
  ];

  const COLORS = [
    "#22c55e",
    "#ef4444"
  ];

  return (
    <ResponsiveContainer
      width="100%"
      height={250}
    >
      <PieChart>

        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="45%"
          outerRadius={70}
          label
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[index]}
            />
          ))}
        </Pie>

        <Tooltip />

        <Legend
          verticalAlign="bottom"
          align="center"
          iconType="circle"
          wrapperStyle={{
            color: "#ffffff",
            fontSize: "13px",
            fontWeight: "600"
          }}
        />

      </PieChart>
    </ResponsiveContainer>
  );
}