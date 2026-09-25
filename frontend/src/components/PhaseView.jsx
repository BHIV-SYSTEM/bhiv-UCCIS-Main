import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Tooltip,
  Cell
} from "recharts";

function PhaseView({
  title,
  data
}) {
  if (!data) {
    return (
      <div className="panel">
        Loading...
      </div>
    );
  }

  const chartData = [
    {
      name: "Runtime",
      value:
        data.runtimeHealth || 0
    },

    {
      name: "Risk",
      value: data.risk || 0
    }
  ];

  return (
    <div>
      <div className="panel">
        <h2>{title}</h2>

        <div className="intel-grid">
          <div className="intel-card">
            <span>
              Runtime
              Health
            </span>

            <h3>
              {
                data.runtimeHealth
              }
              %
            </h3>
          </div>

          <div className="intel-card">
            <span>
              Incidents
            </span>

            <h3>
              {data.incidents}
            </h3>
          </div>

          <div className="intel-card">
            <span>
              Operators
            </span>

            <h3>
              {data.operators}
            </h3>
          </div>

          <div className="intel-card">
            <span>
              Threat
            </span>

            <h3>
              {data.threat}
            </h3>
          </div>
        </div>
      </div>

      <div className="command-card">
        <div className="card-header">
          <h2>
            Backend
            Runtime
          </h2>
        </div>

        <div className="chart-box">
          <ResponsiveContainer
            width="100%"
            height={260}
          >
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                outerRadius={90}
              >
                <Cell fill="#3b82f6" />

                <Cell fill="#ef4444" />
              </Pie>

              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="panel">
        <h2>
          Backend JSON
        </h2>

        <pre className="json-box">
          {JSON.stringify(
            data,
            null,
            2
          )}
        </pre>
      </div>
    </div>
  );
}

export default PhaseView;