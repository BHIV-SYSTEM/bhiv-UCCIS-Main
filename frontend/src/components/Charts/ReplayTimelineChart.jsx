import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function ReplayTimelineChart() {

  const data = [
    {
      time: "10:00",
      events: 12
    },
    {
      time: "10:05",
      events: 22
    },
    {
      time: "10:10",
      events: 30
    },
    {
      time: "10:15",
      events: 40
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
          top: 15,
          right: 20,
          left: 20,
          bottom: 35
        }}
      >

        <XAxis
          dataKey="time"
          label={{
            value: "Time",
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
            position: "insideLeft",
            fill: "#ffffff",
            fontSize: 14,
            fontWeight: "bold"
          }}
        />

        <Tooltip />

        <Area
          type="monotone"
          dataKey="events"
          stroke="#38bdf8"
          fill="#38bdf8"
          fillOpacity={0.4}
        />

      </AreaChart>
    </ResponsiveContainer>
  );
}