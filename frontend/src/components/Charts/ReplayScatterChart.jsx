import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function ReplayScatterChart() {

  const data = [
    {
      x: 10,
      y: 30
    },
    {
      x: 20,
      y: 45
    },
    {
      x: 30,
      y: 60
    },
    {
      x: 40,
      y: 80
    }
  ];

  return (
    <ResponsiveContainer
      width="100%"
      height={260}
    >
      <ScatterChart
        margin={{
          top: 20,
          right: 20,
          left: 20,
          bottom: 40
        }}
      >

        <XAxis
          dataKey="x"
          type="number"
          label={{
            value: "Replay Phase",
            position: "insideBottom",
            offset: -20,
            fill: "#ffffff",
            fontSize: 14,
            fontWeight: "bold"
          }}
        />

        <YAxis
          dataKey="y"
          type="number"
          label={{
            value: "Risk Score",
            angle: -90,
            position: "insideLeft",
            fill: "#ffffff",
            fontSize: 14,
            fontWeight: "bold"
          }}
        />

        <Tooltip />

        <Scatter
          data={data}
          fill="#22c55e"
        />

      </ScatterChart>
    </ResponsiveContainer>
  );
}