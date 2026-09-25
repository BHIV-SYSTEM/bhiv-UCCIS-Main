import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";

export default function EnforcementBarChart() {

  const data = [
    {
      stage: "Signal",
      value: 100
    },

    {
      stage: "Governance",
      value: 92
    },

    {
      stage: "Request",
      value: 85
    },

    {
      stage: "Acknowledged",
      value: 78
    },

    {
      stage: "Replay",
      value: 95
    }
  ];

  const colors = [
    "#38bdf8",
    "#22c55e",
    "#f59e0b",
    "#ef4444",
    "#a855f7"
  ];

  return (
    <ResponsiveContainer
      width="100%"
      height={270}
    >
      <BarChart
        data={data}
        margin={{
          top: 20,
          right: 20,
          left: 20,
          bottom: 50
        }}
      >

        <XAxis
          dataKey="stage"
          interval={0}
          tick={{
            fill: "#cbd5e1",
            fontSize: 12
          }}
          axisLine={{
            stroke: "#475569"
          }}
          tickLine={false}
          label={{
            value: "Enforcement Stage",
            position: "insideBottom",
            offset: -25,
            fill: "#ffffff",
            fontSize: 14,
            fontWeight: "bold"
          }}
        />

        <YAxis
          domain={[0, 100]}
          ticks={[0, 20, 40, 60, 80, 100]}
          tick={{
            fill: "#cbd5e1",
            fontSize: 12
          }}
          axisLine={{
            stroke: "#475569"
          }}
          tickLine={false}
          label={{
            value: "Performance Score",
            angle: -90,
            position: "outsideLeft",
            fill: "#ffffff",
            fontSize: 14,
            fontWeight: "bold"
          }}
        />

        <Tooltip />

        <Bar
          dataKey="value"
          name="Performance Score"
          radius={[6, 6, 0, 0]}
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={colors[index]}
            />
          ))}
        </Bar>

      </BarChart>
    </ResponsiveContainer>
  );
}