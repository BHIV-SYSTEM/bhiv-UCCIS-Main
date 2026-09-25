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

function IncidentChartTask34() {

  const data = [
    {
      type: "Flood",
      count: 12
    },
    {
      type: "Traffic",
      count: 8
    },
    {
      type: "Power",
      count: 5
    },
    {
      type: "Weather",
      count: 10
    }
  ];

  const colors = [
    "#2563eb", // Flood
    "#f59e0b", // Traffic
    "#ef4444", // Power
    "#10b981"  // Weather
  ];

  return (
    <div className="chart-container">

      <h2>Incident Analytics</h2>

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
    value: "Incident Type",
    position: "insideBottom",
    offset: -1,
  }}
/>

<YAxis
  label={{
    value: "Incident Count",
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

export default IncidentChartTask34;