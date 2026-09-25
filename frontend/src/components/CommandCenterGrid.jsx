import {
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Tooltip,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts";

function CommandCenterGrid({
  runtime
}) {
  if (!runtime) return null;

  const telemetryData = [
    {
      name: "T1",
      value: 20
    },

    {
      name: "T2",
      value: 35
    },

    {
      name: "T3",
      value: 48
    },

    {
      name: "T4",
      value:
        runtime.telemetry
          .heartbeat
    }
  ];

  const pieData = [
    {
      name: "Health",
      value:
        100 -
        runtime.telemetry
          .entropy
    },

    {
      name: "Risk",
      value:
        runtime.telemetry
          .entropy
    }
  ];

  return (
    <div className="command-grid">
      {/* AREA */}

      <div className="command-card">
        <div className="card-header">
          <h2>
            Runtime
            Telemetry
          </h2>
        </div>

        <div className="chart-box">
          <ResponsiveContainer
            width="100%"
            height={260}
          >
            <AreaChart
              data={
                telemetryData
              }
            >
              <CartesianGrid
                strokeDasharray="3 3"
              />

              <XAxis dataKey="name" />

              <YAxis />

              <Tooltip />

              <Area
                type="monotone"
                dataKey="value"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* PIE */}

      <div className="command-card">
        <div className="card-header">
          <h2>
            Operational
            Health
          </h2>
        </div>

        <div className="chart-box">
          <ResponsiveContainer
            width="100%"
            height={260}
          >
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                outerRadius={90}
              >
                <Cell fill="#22c55e" />

                <Cell fill="#ef4444" />
              </Pie>

              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* BAR */}

      <div className="command-card">
        <div className="card-header">
          <h2>
            Operational
            Load
          </h2>
        </div>

        <div className="chart-box">
          <ResponsiveContainer
            width="100%"
            height={260}
          >
            <BarChart
              data={
                telemetryData
              }
            >
              <CartesianGrid
                strokeDasharray="3 3"
              />

              <XAxis dataKey="name" />

              <YAxis />

              <Tooltip />

              <Bar dataKey="value" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default CommandCenterGrid;