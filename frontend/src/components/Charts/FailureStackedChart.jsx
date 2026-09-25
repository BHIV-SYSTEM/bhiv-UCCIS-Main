import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function FailureStackedChart() {

  const data = [
    {
      time: "T1",
      failures: 4,
      recovered: 2
    },

    {
      time: "T2",
      failures: 8,
      recovered: 6
    },

    {
      time: "T3",
      failures: 12,
      recovered: 10
    },

    {
      time: "T4",
      failures: 6,
      recovered: 5
    }
  ];

  return (
    <ResponsiveContainer
      width="100%"
      height={260}
    >
      <AreaChart
        data={data}
        margin={{
          top: 20,
          right: 20,
          left: 20,
          bottom: 40
        }}
      >

        <XAxis
          dataKey="time"
          label={{
            value: "Failure Timeline",
            position: "insideBottom",
            offset: -20,
            fill: "#ffffff",
            fontSize: 14,
            fontWeight: "bold"
          }}
        />

        <YAxis
          label={{
            value: "Event Count",
            angle: -90,
            position: "outsideLeft",
            fill: "#ffffff",
            fontSize: 14,
            fontWeight: "bold"
          }}
        />

        <Tooltip />

        <Area
          type="monotone"
          dataKey="failures"
          name="Failures"
          stackId="1"
          stroke="#ef4444"
          fill="#ef4444"
        />

        <Area
          type="monotone"
          dataKey="recovered"
          name="Recovered"
          stackId="1"
          stroke="#22c55e"
          fill="#22c55e"
        />

      </AreaChart>
    </ResponsiveContainer>
  );
}