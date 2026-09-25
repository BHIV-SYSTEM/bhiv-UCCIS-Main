import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

export default function OperatorConcurrencyChart() {

  const data = [
    {
      operator: "OPERATOR_1",
      acknowledgements: 12,
      escalations: 8
    },

    {
      operator: "OPERATOR_2",
      acknowledgements: 15,
      escalations: 10
    },

    {
      operator: "OPERATOR_3",
      acknowledgements: 9,
      escalations: 6
    }
  ];

  return (
    <ResponsiveContainer
      width="100%"
      height={260}
    >
      <BarChart
        data={data}
        margin={{
          top: 20,
          right: 20,
          left: 20,
          bottom: 10
        }}
      >

        <XAxis
          dataKey="operator"
          label={{
            value: "Operator",
            position: "insideBottom",
            offset: -20,
            fill: "#ffffff",
            fontSize: 14,
            fontWeight: "bold"
          }}
        />

        <YAxis
          label={{
            value: "Activity Count",
            angle: -90,
            position: "outsideLeft",
            fill: "#ffffff",
            fontSize: 14,
            fontWeight: "bold"
          }}
        />

        <Tooltip />

        <Legend />

        <Bar
          dataKey="acknowledgements"
          name="Acknowledgements"
          fill="#38bdf8"
          radius={[5, 5, 0, 0]}
        />

        <Bar
          dataKey="escalations"
          name="Escalations"
          fill="#f59e0b"
          radius={[5, 5, 0, 0]}
        />

      </BarChart>
    </ResponsiveContainer>
  );
}