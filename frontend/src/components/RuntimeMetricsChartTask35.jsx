import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell
} from "recharts";

export default function RuntimeMetricsChartTask35({ stats }) {

  const data = [
    {
      name: "Signals",
      value: stats.activeSignals
    },
    {
      name: "Incidents",
      value: stats.incidents
    },
    {
      name: "Escalations",
      value: stats.escalations
    },
    {
      name: "Traces",
      value: stats.traces
    }
  ];

  const colors = [
    "#2563EB",
    "#F59E0B",
    "#DC2626",
    "#8B5CF6"
  ];

  return (
    <div className="runtime-chart-card">

      <h2 className="runtime-chart-title">
        Runtime Metrics
      </h2>

      <ResponsiveContainer width="100%" height={340}>
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 25,
            left: 0,
            bottom: 10
          }}
        >

          <CartesianGrid
            stroke="#8A8A8A"
            strokeDasharray="4 4"
          />

          <XAxis
  dataKey="name"
  tick={{
    fill: "#808080",
    fontSize: 18
  }}
  axisLine={{
    stroke: "#8A8A8A"
  }}
  tickLine={false}
  label={{
    value: "Runtime Metric",
    position: "insideBottom",
    offset: -1,
  }}
/>

<YAxis
  tick={{
    fill: "#808080",
    fontSize: 18
  }}
  axisLine={{
    stroke: "#8A8A8A"
  }}
  tickLine={false}
  label={{
    value: "Metric Value",
    angle: -90,
    position: "insideLeft",
  }}
/>

          <Tooltip
            cursor={{
              fill: "rgba(255,255,255,0.05)"
            }}
          />

          <Bar
            dataKey="value"
            radius={[0, 0, 0, 0]}
          >
            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={colors[index]}
              />
            ))}
          </Bar>

        </BarChart>
      </ResponsiveContainer>

    </div>
  );
}