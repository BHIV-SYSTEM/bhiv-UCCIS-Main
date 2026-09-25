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

export default function PlatformReadiness() {
  const data = [
    {
      layer: "Signal Layer",
      readiness: 95
    },
    {
      layer: "Runtime Layer",
      readiness: 90
    },
    {
      layer: "Replay Layer",
      readiness: 85
    },
    {
      layer: "Evidence Layer",
      readiness: 88
    },
    {
      layer: "Dashboard Layer",
      readiness: 92
    },
    {
      layer: "Analytics Layer",
      readiness: 91
    }
  ];

  const COLORS = [
    "#22C55E",
    "#3B82F6",
    "#F59E0B",
    "#8B5CF6",
    "#06B6D4",
    "#EC4899"
  ];

  return (
    <div className="panel">
      <h2>Platform Readiness</h2>

      <ResponsiveContainer
        width="100%"
        height={400}
      >
        <BarChart
          layout="vertical"
          data={data}
        >
          <CartesianGrid
            strokeDasharray="3 3"
          />

          <XAxis
            type="number"
            domain={[0, 100]}
          />

          <YAxis
            dataKey="layer"
            type="category"
            width={120}
          />

          <Tooltip />

          <Bar dataKey="readiness">
            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={
                  COLORS[
                    index %
                      COLORS.length
                  ]
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <h2
        style={{
          textAlign: "center",
          marginTop: "20px",
          color: "#22C55E"
        }}
      >
        OVERALL: PLATFORM READY
      </h2>
    </div>
  );
}