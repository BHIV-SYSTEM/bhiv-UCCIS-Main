import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

export default function SignalTypeChart() {

  const data = [
    { name: "Fire", value: 40 },
    { name: "Flood", value: 25 },
    { name: "Cyber", value: 20 },
    { name: "Medical", value: 35 }
  ];

  return (
    <div className="chart-card signal-type-card">

      <h2>Signal Types</h2>

      <ResponsiveContainer
        width="100%"
        height={300}
      >

        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 20,
            left: 20,
            bottom: 20
          }}
        >

          <CartesianGrid
            stroke="#334155"
            strokeDasharray="3 3"
          />

          <XAxis
            dataKey="name"
            stroke="#94a3b8"
            tick={{
              fill: "#cbd5e1",
              fontSize: 12
            }}
          />

          <YAxis
            stroke="#94a3b8"
            tick={{
              fill: "#cbd5e1",
              fontSize: 12
            }}
            label={{
              value: "Signal Count",
              angle: -90,
              position: "insideLeft",
              fill: "#cbd5e1"
            }}
          />

          <Tooltip
            contentStyle={{
              background: "#0f172a",
              border: "1px solid #334155",
              borderRadius: "8px",
              color: "#ffffff"
            }}
          />

          <Bar
            dataKey="value"
            name="Signals"
            fill="#38bdf8"
            radius={[6, 6, 0, 0]}
            barSize={55}
          />

        </BarChart>

      </ResponsiveContainer>

    </div>
  );
}