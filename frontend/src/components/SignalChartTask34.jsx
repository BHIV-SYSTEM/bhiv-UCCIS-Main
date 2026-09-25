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

function SignalChartTask34() {
  const data = [
    {
      category: "Flood",
      count: 8
    },
    {
      category: "Traffic",
      count: 5
    },
    {
      category: "Power",
      count: 3
    },
    {
      category: "Weather",
      count: 6
    }
  ];

  const colors = [
    "#2563eb", // Flood - Blue
    "#f59e0b", // Traffic - Orange
    "#ef4444", // Power - Red
    "#10b981"  // Weather - Green
  ];

  return (
    <div className="chart-container">

      <h2>Signal Analytics</h2>

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
  dataKey="category"
  label={{
    value: "Signal Category",
    position: "insideBottom",
    offset: -2,
  }}
/>

<YAxis
  label={{
    value: "Number of Signals",
    angle: -90,
    position: "insideLeft",
  }}
/>

            <Tooltip />

            <Bar dataKey="count">
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
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

export default SignalChartTask34;