import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Label
} from "recharts";

function RuntimeMetricsChartTask34() {
  const data = [
    {
      name: "Signals",
      value: 12
    },
    {
      name: "Telemetry",
      value: 25
    },
    {
      name: "Incidents",
      value: 10
    },
    {
      name: "Escalations",
      value: 12
    },
    {
      name: "Replay",
      value: 18
    },
    {
      name: "Evidence",
      value: 32
    }
  ];

  return (
    <div className="chart-container">
      <h3>Runtime Metrics</h3>

      <div
        style={{
          width: "100%",
          height: 350
        }}
      >
        <ResponsiveContainer>
          <BarChart data={data}>
            <XAxis dataKey="name">
              <Label
                value="Runtime Metrics"
                position="insideBottom"
                offset={-1}
              />
            </XAxis>

            <YAxis>
              <Label
                value="Metric Count"
                angle={-90}
                position="insideLeft"
                style={{ textAnchor: "middle" }}
              />
            </YAxis>

            <Tooltip />

            <Bar dataKey="value" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default RuntimeMetricsChartTask34;