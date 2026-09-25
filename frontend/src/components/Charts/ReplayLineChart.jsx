import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function ReplayLineChart() {

  const data = [
    { name: "P1", replay: 12 },
    { name: "P2", replay: 20 },
    { name: "P3", replay: 28 },
    { name: "P4", replay: 35 },
    { name: "P5", replay: 40 },
    { name: "P6", replay: 55 },
    { name: "P7", replay: 72 }
  ];

  return (
    <ResponsiveContainer
      width="100%"
      height={250}
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
          dataKey="name"
          label={{
            value: "Replay Phase",
            position: "insideBottom",
            offset: -15
          }}
        />

        <YAxis
          label={{
            value: "Replay Score",
            angle: -90,
            position: "insideLeft"
          }}
        />

        <Tooltip />

        <Line
          type="monotone"
          dataKey="replay"
          stroke="#38bdf8"
          strokeWidth={3}
          dot={{ r: 4 }}
        />

      </LineChart>
    </ResponsiveContainer>
  );
}