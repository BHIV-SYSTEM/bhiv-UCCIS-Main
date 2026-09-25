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

function ObservabilityChart() {

  const data = [
    {
      metric: "Signals",
      count: 24
    },
    {
      metric: "Telemetry",
      count: 42
    },
    {
      metric: "Incidents",
      count: 18
    },
    {
      metric: "Evidence",
      count: 35
    }
  ];

  const colors = [
    "#2563eb",
    "#10b981",
    "#f59e0b",
    "#ef4444"
  ];

  return (
    <div className="chart-container">

      <h2>Runtime Analytics</h2>

      <div
        style={{
          width: "100%",
          height: "350px"
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
  dataKey="metric"
  label={{
    value: "Runtime Metric",
    position: "insideBottom",
    offset: -1,
  }}
/>

<YAxis
  label={{
    value: "Runtime Count",
    angle: -90,
    position: "insideLeft",
  }}
/>

            <Tooltip />

            <Bar dataKey="count">
              {data.map((item, index) => (
                <Cell
                  key={index}
                  fill={colors[index]}
                />
              ))}
            </Bar>

          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}

export default ObservabilityChart;