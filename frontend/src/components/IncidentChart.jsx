import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend
} from "recharts";

export default function IncidentChart() {

  const data = [
    {
      name: "Critical",
      value: 20
    },
    {
      name: "High",
      value: 40
    },
    {
      name: "Medium",
      value: 25
    },
    {
      name: "Low",
      value: 15
    }
  ];

  /* =========================
     COLORS
  ========================= */

  const COLORS = [
    "#ef4444", // Critical - Red
    "#f97316", // High - Orange
    "#f59e0b", // Medium - Yellow
    "#22c55e"  // Low - Green
  ];


  /* =========================
     CUSTOM TOOLTIP
  ========================= */

  const CustomTooltip = ({ active, payload }) => {

    if (!active || !payload || !payload.length) {
      return null;
    }

    const item = payload[0];

    return (
      <div
        style={{
          background: "#0f172a",
          border: "1px solid #334155",
          borderRadius: "8px",
          padding: "10px 14px",
          color: "#ffffff",
          boxShadow: "0 4px 15px rgba(0,0,0,0.35)"
        }}
      >

        <div
          style={{
            fontWeight: "700",
            marginBottom: "4px"
          }}
        >
          {item.name}
        </div>

        <div
          style={{
            color: "#cbd5e1"
          }}
        >
          Incidents: {item.value}%
        </div>

      </div>
    );
  };


  return (

    <div
      className="chart-card"
      style={{
        width: "100%",
        minHeight: "420px"
      }}
    >

      {/* =========================
          TITLE
      ========================= */}

      <h2
        style={{
          color: "#ffffff",
          fontSize: "22px",
          fontWeight: "700",
          marginBottom: "10px"
        }}
      >
        Incident Severity
      </h2>


      {/* =========================
          DESCRIPTION
      ========================= */}

      <p
        style={{
          color: "#94a3b8",
          fontSize: "13px",
          marginBottom: "5px"
        }}
      >
        Distribution of incidents by severity level
      </p>


      {/* =========================
          CHART
      ========================= */}

      <div
        style={{
          width: "100%",
          height: "330px"
        }}
      >

        <ResponsiveContainer
          width="100%"
          height="100%"
        >

          <PieChart>

            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="45%"
              outerRadius={105}
              innerRadius={45}
              paddingAngle={2}
              labelLine={false}
              label={({ name, value }) =>
                `${name} ${value}%`
              }
            >

              {data.map((entry, index) => (

                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index]}
                />

              ))}

            </Pie>


            {/* =========================
                TOOLTIP
            ========================= */}

            <Tooltip
              content={<CustomTooltip />}
            />


            {/* =========================
                LEGEND
            ========================= */}

            <Legend
              verticalAlign="bottom"
              align="center"
              layout="horizontal"
              iconType="circle"
              wrapperStyle={{
                color: "#cbd5e1",
                fontSize: "12px",
                paddingTop: "10px"
              }}
            />

          </PieChart>

        </ResponsiveContainer>

      </div>

    </div>

  );
}