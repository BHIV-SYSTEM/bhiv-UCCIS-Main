import { phaseData } from "../data/phaseData";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Legend,
} from "recharts";

export default function PhaseViewTask28({ phase }) {

  const data = phaseData[phase];

  const PIE_COLORS = [
  "#2563eb",
  "#16a34a",
  "#dc2626",
  "#f59e0b",
  "#9333ea",
  "#0891b2",
];

  if (!data) return null;

  return (
    <div>

      <h1>{data.title}</h1>

      {/* KPI CARDS */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(220px,1fr))",
          gap: "20px",
          marginBottom: "30px"
        }}
      >
        {Object.entries(data.cards).map(
          ([key, value]) => (
            <div
              key={key}
              style={{
                background: "#1e293b",
                padding: "20px",
                borderRadius: "10px"
              }}
            >
              <h3>{key}</h3>
              <h1>{value}</h1>
            </div>
          )
        )}
      </div>

      {/* CHARTS */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
          marginBottom: "30px"
        }}
      >
        <div
          style={{
            background: "#1e293b",
            padding: "20px",
            borderRadius: "10px"
          }}
        >
          <h2>Bar Chart</h2>

          <ResponsiveContainer
            width="100%"
            height={300}
          >
            <BarChart data={data.barData}>
              <CartesianGrid />
              <XAxis
  dataKey="name"
  stroke="#cbd5e1"
  label={{
    value: "Category",
    position: "insideBottom",
    offset: -1,
    fill: "#cbd5e1",
  }}
/>

<YAxis
  stroke="#cbd5e1"
  label={{
    value: "Count",
    angle: -90,
    position: "insideLeft",
    fill: "#cbd5e1",
  }}
/>
              <Tooltip />
              <Bar dataKey="value" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div
          style={{
            background: "#1e293b",
            padding: "20px",
            borderRadius: "10px"
          }}
        >
          <h2>Pie Chart</h2>

          <ResponsiveContainer
            width="100%"
            height={300}
          >
            <PieChart>
              <Pie
                data={data.pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="45%"
                outerRadius={100}
                label={({ name, value }) => `${name}: ${value}`}
        labelLine={true}
              >
              {data.pieData.map((entry, index) => (
          <Cell
            key={`cell-${index}`}
            fill={
              PIE_COLORS[
                index % PIE_COLORS.length
              ]
            }
          />
        ))}
        </Pie>
              <Tooltip />
              <Legend
        verticalAlign="bottom"
        align="center"
        layout="horizontal"
      />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* BACKEND RESPONSE */}

      {/* <div
        style={{
          background: "#1e293b",
          padding: "20px",
          borderRadius: "10px"
        }}
      >
        <h2>Backend Response</h2>

        <pre>
          {JSON.stringify(
            data.backend,
            null,
            2
          )}
        </pre>
      </div> */}

    </div>
  );
}