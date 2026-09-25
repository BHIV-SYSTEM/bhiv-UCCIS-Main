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

function EscalationChart() {

  const data = [
    { type: "Flood", count: 14 },
    { type: "Traffic", count: 9 },
    { type: "Power", count: 6 },
    { type: "Weather", count: 11 }
  ];

  const colors = [
    "#2563eb",
    "#f59e0b",
    "#ef4444",
    "#10b981"
  ];

  return (
    <div className="chart-container">

      <h2>Escalation Analytics</h2>

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
    value: "Escalation Type",
    position: "insideBottom",
    offset: -1,
  }}
/>

<YAxis
  label={{
    value: "Escalation Count",
    angle: -90,
    position: "insideLeft",
  }}
/>

            <Tooltip />

            <Bar dataKey="count">
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

    </div>
  );
}

export default EscalationChart;