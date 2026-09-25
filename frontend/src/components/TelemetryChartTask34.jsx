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

function TelemetryChartTask34() {
  const data = [
    {
      source: "Sensors",
      count: 120
    },
    {
      source: "Gateways",
      count: 95
    },
    {
      source: "IoT Devices",
      count: 80
    },
    {
      source: "Runtime",
      count: 65
    }
  ];

  const colors = [
    "#2563eb", // Sensors - Blue
    "#10b981", // Gateways - Green
    "#f59e0b", // IoT Devices - Orange
    "#ef4444"  // Runtime - Red
  ];

  return (
    <div className="chart-container">
      <h2>Telemetry Analytics</h2>

      <div
        style={{
          width: "100%",
          height: "350px"
        }}
      >
        <ResponsiveContainer>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
  dataKey="source"
  label={{
    value: "Telemetry Source",
    position: "insideBottom",
    offset: -1,
  }}
/>

<YAxis
  label={{
    value: "Telemetry Count",
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

export default TelemetryChartTask34;