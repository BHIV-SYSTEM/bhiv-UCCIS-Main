import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function RecoveryLineChart() {

  const data = [
    {
      recovery: "R1",
      continuity: 40
    },

    {
      recovery: "R2",
      continuity: 60
    },

    {
      recovery: "R3",
      continuity: 80
    },

    {
      recovery: "R4",
      continuity: 100
    }
  ];

  return (
    <ResponsiveContainer
      width="100%"
      height={260}
    >
      <LineChart
        data={data}
        margin={{
          top: 20,
          right: 20,
          left: 20,
          bottom: 40
        }}
      >

        <XAxis
          dataKey="recovery"
          label={{
            value: "Recovery Stage",
            position: "insideBottom",
            offset: -20,
            fill: "#ffffff",
            fontSize: 14,
            fontWeight: "bold"
          }}
        />

        <YAxis
          domain={[0, 100]}
          ticks={[0, 20, 40, 60, 80, 100]}
          label={{
            value: "Continuity Score",
            angle: -90,
            position: "outsideLeft",
            fill: "#ffffff",
            fontSize: 14,
            fontWeight: "bold"
          }}
        />

        <Tooltip />

        <Line
          type="monotone"
          dataKey="continuity"
          name="Continuity Score"
          stroke="#22c55e"
          strokeWidth={3}
          dot={{
            r: 5
          }}
          activeDot={{
            r: 7
          }}
        />

      </LineChart>
    </ResponsiveContainer>
  );
}