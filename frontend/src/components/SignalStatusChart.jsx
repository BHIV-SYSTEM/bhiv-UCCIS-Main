import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend
} from "recharts";

export default function SignalStatusChart() {

  const data = [
    {
      name: "Active",
      value: 65
    },
    {
      name: "Resolved",
      value: 37
    },
    {
      name: "Critical",
      value: 18
    }
  ];

  /* =========================
     COLORS
  ========================= */

  const COLORS = [
    "#38bdf8", // Active
    "#22c55e", // Resolved
    "#ef4444"  // Critical
  ];


  /* =========================
     CUSTOM TOOLTIP
  ========================= */

  const CustomTooltip = ({
    active,
    payload
  }) => {

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
          color: "#ffffff"
        }}
      >

        <div
          style={{
            fontWeight: "700",
            marginBottom: "5px"
          }}
        >
          {item.name}
        </div>

        <div
          style={{
            color: "#cbd5e1"
          }}
        >
          Signals: {item.value}
        </div>

      </div>
    );
  };


  /* =========================
     PERCENTAGE LABEL
  ========================= */

  const renderLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent
  }) => {

    const RADIAN = Math.PI / 180;

    const radius =
      innerRadius +
      (outerRadius - innerRadius) * 0.55;

    const x =
      cx +
      radius *
        Math.cos(-midAngle * RADIAN);

    const y =
      cy +
      radius *
        Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="#ffffff"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="12"
        fontWeight="700"
      >
        {`${Math.round(percent * 100)}%`}
      </text>
    );
  };


  return (

    <div
      className="chart-card signal-status-card"
      style={{
        width: "100%",
        minHeight: "420px",
        padding: "20px",
        background: "#131c2e",
        border: "1px solid #24354d",
        borderRadius: "14px"
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
          marginBottom: "5px"
        }}
      >
        Signal Status
      </h2>


      {/* =========================
          DESCRIPTION
      ========================= */}

      <p
        style={{
          color: "#94a3b8",
          fontSize: "13px",
          marginBottom: "10px"
        }}
      >
        Distribution of signals by current status
      </p>


      {/* =========================
          CHART
      ========================= */}

      <div
        style={{
          width: "100%",
          height: "340px"
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

              /* Keep pie safely inside the chart */
              cx="50%"
              cy="44%"

              /* Pie size */
              innerRadius={55}
              outerRadius={105}

              /* Space between slices */
              paddingAngle={3}

              /* Percentage labels inside */
              label={renderLabel}
              labelLine={false}

              stroke="#0f172a"
              strokeWidth={2}
            >

              {data.map(
                (entry, index) => (

                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index]}
                  />

                )
              )}

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
                paddingTop: "8px"
              }}
            />

          </PieChart>

        </ResponsiveContainer>

      </div>

    </div>

  );
}