import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function BarChartCard() {
  const data = [
    { name: "Signals", value: 120 },
    { name: "Events", value: 95 },
    { name: "Incidents", value: 60 },
    { name: "Escalations", value: 40 },
    { name: "Replays", value: 25 },
  ];

  return (
    <div
      style={{
        width: "100%",
        height: "500px",
        background: "#111827",
        borderRadius: "12px",
        padding: "20px",
        boxSizing: "border-box",
        overflowX: "auto",
        overflowY: "hidden",
      }}
    >
      <h2
        style={{
          color: "#ffffff",
          fontSize: "28px",
          fontWeight: "700",
          margin: "0 0 10px 0",
        }}
      >
        Runtime Activity
      </h2>

      {/* CHART CONTAINER */}
      <div
        style={{
          width: "100%",
          minWidth: "760px",
          height: "420px",
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 10,
              right: 30,
              left: 50,
              bottom: 70,
            }}
            barCategoryGap="18%"
          >
            {/* GRID */}
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#475569"
            />

            {/* X AXIS */}
            <XAxis
              dataKey="name"
              interval={0}
              stroke="#94a3b8"
              tick={{
                fill: "#94a3b8",
                fontSize: 15,
              }}
              tickLine={false}
              axisLine={{
                stroke: "#64748b",
              }}
              label={{
                value: "Activity Type",
                position: "insideBottom",
                offset: -45,
                fill: "#94a3b8",
                fontSize: 16,
              }}
            />

            {/* Y AXIS */}
            <YAxis
              stroke="#94a3b8"
              tick={{
                fill: "#94a3b8",
                fontSize: 15,
              }}
              tickLine={false}
              axisLine={{
                stroke: "#64748b",
              }}
              domain={[0, 120]}
              ticks={[0, 30, 60, 90, 120]}
              label={{
                value: "Activity Count",
                angle: -90,
                position: "insideLeft",
                offset: 5,
                fill: "#94a3b8",
                fontSize: 16,
              }}
            />

            {/* TOOLTIP */}
            <Tooltip
              cursor={{
                fill: "rgba(255,255,255,0.05)",
              }}
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
            />

            {/* BARS */}
            <Bar
              dataKey="value"
              fill="#000000"
              barSize={70}
              radius={[3, 3, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}