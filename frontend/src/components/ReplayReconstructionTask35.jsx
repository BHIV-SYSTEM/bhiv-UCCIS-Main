import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

export default function ReplayReconstructionTask35() {
  const data = [
    {
      name: "Original Incident",
      value: 24
    },
    {
      name: "Escalated",
      value: 12
    },
    {
      name: "Replay Generated",
      value: 14
    },
    {
      name: "Evidence Linked",
      value: 22
    }
  ];

  const COLORS = [
    "#2563EB",
    "#F59E0B",
    "#8B5CF6",
    "#16A34A"
  ];

  return (
    <div className="panel">
      <h2>Replay Reconstruction</h2>

      <ResponsiveContainer
        width="100%"
        height={350}
      >
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={70}
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