import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function PieChartCard() {
  const data = [
    { name: "Critical", value: 20 },
    { name: "High", value: 35 },
    { name: "Medium", value: 25 },
    { name: "Low", value: 20 },
  ];

  const COLORS = [
    "#ef4444",
    "#f97316",
    "#eab308",
    "#22c55e",
  ];

  return (
    <div
      style={{
        width: "100%",
        height: "420px",
        background: "#111827",
        borderRadius: "12px",
        padding: "20px",
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      {/* TITLE */}
      <h2
        style={{
          color: "#ffffff",
          fontSize: "28px",
          fontWeight: "700",
          margin: "0 0 5px 0",
        }}
      >
        Incident Severity
      </h2>

      {/* CHART */}
      <div
        style={{
          width: "100%",
          height: "340px",
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="43%"
              outerRadius={115}
              label={({ value }) => `${value}%`}
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index]}
                  stroke="#111827"
                  strokeWidth={2}
                />
              ))}
            </Pie>

            <Tooltip
              contentStyle={{
                backgroundColor: "#111827",
                border: "1px solid #334155",
                borderRadius: "8px",
                color: "#ffffff",
              }}
              labelStyle={{
                color: "#ffffff",
              }}
              itemStyle={{
                color: "#ffffff",
              }}
              formatter={(value, name) => [
                `${value}%`,
                name,
              ]}
            />

            <Legend
              verticalAlign="bottom"
              align="center"
              height={40}
              iconType="square"
              wrapperStyle={{
                color: "#ffffff",
                fontSize: "16px",
                fontWeight: "500",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}