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

function ReplayChartTask34() {

  const data = [
    {
      type: "Flood Replay",
      count: 18
    },
    {
      type: "Traffic Replay",
      count: 12
    },
    {
      type: "Power Replay",
      count: 8
    },
    {
      type: "Weather Replay",
      count: 15
    }
  ];

  const colors = [
    "#2563eb",
    "#f59e0b",
    "#ef4444",
    "#10b981"
  ];

  return (
    <div className="chart-container">

      <h2>Replay Analytics</h2>

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
  dataKey="type"
  label={{
    value: "Replay Type",
    position: "insideBottom",
    offset: -5,
  }}
/>

<YAxis
  label={{
    value: "Replay Count",
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

export default ReplayChartTask34;