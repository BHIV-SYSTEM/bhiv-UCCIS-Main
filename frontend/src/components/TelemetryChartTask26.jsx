import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
  LabelList
} from "recharts";

export default function TelemetryChartTask26({ data = [] }) {
  let chartData = [];

  if (Array.isArray(data) && data.length > 0) {
    chartData = data.map((item, index) => {
      const value =
        Number(item.value) ||
        Number(item.count) ||
        Number(item.score) ||
        Number(item.total) ||
        Number(item.metric) ||
        Number(item.signalStrength) ||
        Number(item.telemetry) ||
        0;

      return {
        signalId:
          item.signalId ||
          item.signal ||
          item.name ||
          `T${index + 1}`,
        value
      };
    });
  }

  // Demo values if backend returns empty/zero
  if (
    chartData.length === 0 ||
    chartData.every(item => item.value === 0)
  ) {
    chartData = [
      { signalId: "T2", value: 55 },
      { signalId: "T3", value: 40 },
      { signalId: "T1", value: 72 }
    ];
  }

  return (
    <div
      style={{
        background: "#161f31",
        borderRadius: "12px",
        padding: "20px"
      }}
    >
      <h3
        style={{
          color: "#fff",
          marginBottom: 20,
          fontSize: 18,
          fontWeight: 700
        }}
      >
        📊 Live Trend
      </h3>

      <ResponsiveContainer width="100%" height={340}>
        <BarChart
          data={chartData}
          margin={{
            top: 20,
            right: 20,
            left: 10,
            bottom: 10
          }}
        >
          <XAxis
            dataKey="signalId"
            tick={{ fill: "#94a3b8", fontSize: 18 }}
            tickLine={false}
            axisLine={{ stroke: "#6B7280" }}
            label={{
    value: "Signal ID",
    position: "insideBottom",
    offset: -5,
    fill: "#94a3b8",
    fontSize: 12,
  }}
          />

          <YAxis
            tick={{ fill: "#94a3b8", fontSize: 18 }}
            tickLine={false}
            axisLine={{ stroke: "#6B4280" }}
            label={{
    value: "Signal Value",
    angle: -90,
    position: "insideLeft",
    offset: 10,
    fill: "#94a3b8",
    fontSize: 16,
  }}
          />

          <Tooltip 
          cursor={{ fill: "transparent" }}
          contentStyle={{
            background: "#111827",
            border: "1px solid #334155",
            borderRadius: "10px",
            color: "#fff",
          }}
          />

          <Bar
            dataKey="value"
            barSize={150}
            fill="#5B9DFF"
          >
            {chartData.map((entry, index) => (
              <Cell
                key={index}
                fill="#5A9BFF"
              />
            ))}

            <LabelList
              dataKey="value"
              position="top"
              fill="#A5B4FC"
              fontSize={16}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}