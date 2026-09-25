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

export default function TraceLineage() {
  const data = [
    {
      stage: "Signal-A",
      count: 24
    },
    {
      stage: "Telemetry-B",
      count: 20
    },
    {
      stage: "Incident-C",
      count: 8
    },
    {
      stage: "Escalation-D",
      count: 3
    },
    {
      stage: "Replay-E",
      count: 14
    }
  ];

  const COLORS = [
    "#2563EB",
    "#14B8A6",
    "#F59E0B",
    "#DC2626",
    "#8B5CF6"
  ];

  return (
    <div className="panel">
      <h2>Trace Lineage Viewer</h2>

      <ResponsiveContainer
        width="100%"
        height={350}
      >
        <BarChart
          layout="vertical"
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 40,
            bottom: 20
          }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
          />

          <XAxis type="number" />

          <YAxis
            type="category"
            dataKey="stage"
          />

          <Tooltip />

          <Bar dataKey="count">
            {data.map(
              (entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    COLORS[
                      index %
                        COLORS.length
                    ]
                  }
                />
              )
            )}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div
        style={{
          marginTop: "20px"
        }}
      >
        <table>
          <thead>
            <tr>
              <th>Stage</th>
              <th>Count</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td style={{ color: "#000000"}}>Signal-A</td>
              <td style={{ color: "#000000"}}>24</td>
              <td style={{ color: "#000000"}}>ACTIVE</td>
            </tr>

            <tr>
              <td style={{ color: "#000000"}}>Telemetry-B</td>
              <td style={{ color: "#000000"}}>20</td>
              <td style={{ color: "#000000"}}>ACTIVE</td>
            </tr>

            <tr>
              <td style={{ color: "#000000"}}>Incident-C</td>
              <td style={{ color: "#000000"}}>8</td>
              <td style={{ color: "#000000"}}>ACTIVE</td>
            </tr>

            <tr>
              <td style={{ color: "#000000"}}>Escalation-D</td>
              <td style={{ color: "#000000"}}>3</td>
              <td style={{ color: "#000000"}}>CRITICAL</td>
            </tr>

            <tr>
              <td style={{ color: "#000000"}}>Replay-E</td>
              <td style={{ color: "#000000"}}>14</td>
              <td style={{ color: "#000000"}}>REPLAYING</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}