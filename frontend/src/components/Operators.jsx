import {
  BarChart,
  Bar,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts";

export default function Operators() {

  const operatorData = [
    { name: "ACK", value: 18 },
    { name: "Replay", value: 12 },
    { name: "Audit", value: 8 },
    { name: "Recovery", value: 16 }
  ];

  /*
   * White tooltip for better readability
   * on the dark dashboard.
   */
  const WhiteTooltip = ({
    active,
    payload,
    label
  }) => {

    if (
      !active ||
      !payload ||
      payload.length === 0
    ) {
      return null;
    }

    return (
      <div
        style={{
          background: "#141d28",
          border: "1px solid #526174",
          borderRadius: "6px",
          padding: "10px 12px",
          color: "#ffffff",
          boxShadow:
            "0 4px 15px rgba(0, 0, 0, 0.35)"
        }}
      >

        <div
          style={{
            color: "#ffffff",
            fontSize: "12px",
            fontWeight: 700,
            marginBottom: "6px"
          }}
        >
          {label}
        </div>

        {payload.map(
          (item, index) => (

            <div
              key={`${item.name}-${index}`}
              style={{
                color: "#ffffff",
                fontSize: "12px",
                lineHeight: 1.5
              }}
            >
              {item.name || "Actions"}:{" "}
              {Number(item.value).toLocaleString()}
            </div>

          )
        )}

      </div>
    );
  };

  /*
   * Calculate total operator actions
   * from the chart data.
   */
  const totalActions =
    operatorData.reduce(
      (total, item) =>
        total + item.value,
      0
    );

  /*
   * Find the highest activity type.
   */
  const highestActivity =
    operatorData.reduce(
      (highest, current) =>
        current.value > highest.value
          ? current
          : highest,
      operatorData[0]
    );

  return (

    <div className="page">

      {/* ================================================= */}
      {/* PAGE TITLE                                        */}
      {/* ================================================= */}

      <h1>
        Operator Activity Center
      </h1>

      {/* ================================================= */}
      {/* STAT CARDS                                        */}
      {/* ================================================= */}

      <div className="stats-grid">

        <div className="stat-card">

          <p className="stat-title">
            Operators Online
          </p>

          <h1>
            12
          </h1>

        </div>

        <div className="stat-card">

          <p className="stat-title">
            Concurrency
          </p>

          <h1 className="green-text">
            STABLE
          </h1>

        </div>

        <div className="stat-card">

          <p className="stat-title">
            Total Actions
          </p>

          <h1>
            {totalActions}
          </h1>

        </div>

      </div>

      {/* ================================================= */}
      {/* OPERATOR ACTION CHART                             */}
      {/* ================================================= */}

      <div className="panel">

        <h2>
          Operator Actions
        </h2>

        <ResponsiveContainer
          width="100%"
          height={300}
        >

          <BarChart
            data={operatorData}
            margin={{
              top: 20,
              right: 20,
              left: 15,
              bottom: 50
            }}
            barCategoryGap="28%"
          >

            <CartesianGrid
              stroke="#1e293b"
              vertical={false}
            />

            <XAxis
              dataKey="name"
              tick={{
                fill: "#8b96a5",
                fontSize: 11
              }}
              tickMargin={8}
              axisLine={{
                stroke: "#273344"
              }}
              label={{
                value:
                  "Operator Actions",
                position:
                  "insideBottom",
                offset: -30,
                fill:
                  "#d6dde5",
                fontSize: 13
              }}
            />

            <YAxis
              tick={{
                fill: "#8b96a5",
                fontSize: 11
              }}
              width={50}
              axisLine={{
                stroke: "#273344"
              }}
              label={{
                value:
                  "Action Count",
                angle: -90,
                position:
                  "insideLeft",
                offset: 5,
                fill:
                  "#d6dde5",
                fontSize: 13
              }}
            />

            <Tooltip
              content={
                <WhiteTooltip />
              }
            />

            <Bar
              dataKey="value"
              name="Actions"
              fill="#00ff90"
              radius={[
                5,
                5,
                0,
                0
              ]}
              maxBarSize={85}
            />

          </BarChart>

        </ResponsiveContainer>

      </div>

      {/* ================================================= */}
      {/* OPERATOR SUMMARY                                  */}
      {/* ================================================= */}

      <div
        className="panel"
        style={{
          marginTop: "16px"
        }}
      >

        <h2>
          Operator Activity Summary
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(2, minmax(0, 1fr))",
            gap: "16px"
          }}
        >

          <div>

            <p
              style={{
                margin: 0,
                color: "#8b96a5",
                fontSize: "12px"
              }}
            >
              Total Actions
            </p>

            <strong
              style={{
                display: "block",
                marginTop: "5px",
                color: "#ffffff",
                fontSize: "20px"
              }}
            >
              {totalActions}
            </strong>

          </div>

          <div>

            <p
              style={{
                margin: 0,
                color: "#8b96a5",
                fontSize: "12px"
              }}
            >
              Highest Activity
            </p>

            <strong
              style={{
                display: "block",
                marginTop: "5px",
                color: "#00ff90",
                fontSize: "20px"
              }}
            >
              {highestActivity.name}
            </strong>

          </div>

        </div>

      </div>

      {/* ================================================= */}
      {/* BACKEND RESPONSE                                  */}
      {/* ================================================= */}

      {/*
      <div className="panel">

        <h2>
          Backend Operator Response
        </h2>

        <div className="terminal-box">

          <pre>
{`{
  "operatorsActive": 12,
  "concurrency": "STABLE",
  "acknowledgements": 184
}`}
          </pre>

        </div>

      </div>
      */}

    </div>

  );

}