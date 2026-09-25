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

function EvidenceChart() {

  const data = [
    {
      category: "Images",
      count: 18
    },
    {
      category: "Videos",
      count: 12
    },
    {
      category: "Documents",
      count: 25
    },
    {
      category: "Reports",
      count: 15
    }
  ];

  const colors = [
    "#2563eb",
    "#10b981",
    "#f59e0b",
    "#ef4444"
  ];

  return (
    <div className="chart-container">

      <h2>Evidence Analytics</h2>

      <div
        style={{
          width: "100%",
          height: "350px"
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
  dataKey="category"
  label={{
    value: "Evidence Category",
    position: "insideBottom",
    offset: -1,
  }}
/>

<YAxis
  label={{
    value: "Evidence Count",
    angle: -90,
    position: "insideLeft",
  }}
/>

            <Tooltip />

            <Bar dataKey="count">
              {data.map((item, index) => (
                <Cell
                  key={index}
                  fill={colors[index]}
                />
              ))}
            </Bar>

          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}

export default EvidenceChart;