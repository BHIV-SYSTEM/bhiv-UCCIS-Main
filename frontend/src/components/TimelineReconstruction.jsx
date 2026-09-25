import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

export default function TimelineReconstruction() {
  const data = [
    { name: "Signal", value: 24 },
    { name: "Telemetry", value: 20 },
    { name: "Incident", value: 8 },
    { name: "Escalation", value: 3 },
    { name: "Replay", value: 14 }
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
      <h2>Timeline Reconstruction</h2>

      <ResponsiveContainer
        width="100%"
        height={350}
      >
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={120}
            dataKey="value"
            label
          >
            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={
                  COLORS[
                    index % COLORS.length
                  ]
                }
              />
            ))}
          </Pie>

          <Tooltip />

          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}