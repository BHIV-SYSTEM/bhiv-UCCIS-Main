import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function LifecycleBarChart() {

  const data = [
    {
      phase: "Signal",
      value: 100
    },
    {
      phase: "Governance",
      value: 92
    },
    {
      phase: "Enforcement",
      value: 87
    },
    {
      phase: "Replay",
      value: 95
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
          bottom: 40
        }}
      >

        <XAxis
          dataKey="phase"
          label={{
            value: "Lifecycle Phase",
            position: "insideBottom",
            offset: -20,
            fill: "#ffffff",
            fontSize: 14,
            fontWeight: "bold"
          }}
        />

        <YAxis
          domain={[0, 100]}
          label={{
            value: "Completion Score",
            angle: -90,
            position: "outsideLeft",
            fill: "#ffffff",
            fontSize: 12,
            fontWeight: "bold"
          }}
        />

        <Tooltip />

        <Bar
          dataKey="value"
          name="Completion Score"
          fill="#22c55e"
          radius={[6, 6, 0, 0]}
        />

      </BarChart>
    </ResponsiveContainer>
  );
}