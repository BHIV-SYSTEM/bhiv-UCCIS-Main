import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

export default function
OperationalDonutChart() {

  const data = [
    {
      name: "Replay",
      value: 25
    },

    {
      name: "Lifecycle",
      value: 20
    },

    {
      name: "Concurrency",
      value: 18
    },

    {
      name: "Recovery",
      value: 17
    },

    {
      name: "Observability",
      value: 20
    }
  ];

  const COLORS = [
    "#38bdf8",
    "#22c55e",
    "#f59e0b",
    "#ef4444",
    "#a855f7"
  ];

  return (

    <ResponsiveContainer
      width="100%"
      height={240}
    >

      <PieChart>

        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={50}
          outerRadius={90}
          paddingAngle={4}
          dataKey="value"
        >

          {
            data.map((entry, index) => (

              <Cell
                key={index}
                fill={
                  COLORS[index]
                }
              />

            ))
          }

        </Pie>

        <Tooltip />

        <Legend />

      </PieChart>

    </ResponsiveContainer>
  );
}