import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const Phase1 = () => {

  const data = [

    {
      name: "Mumbai",
      alerts: 12
    },

    {
      name: "Thane",
      alerts: 7
    },

    {
      name: "MMR",
      alerts: 9
    }

  ];

  return (

    <div>

      <h1 className="phase-title">
        PHASE 1 — DEMO READINESS
      </h1>

      <div className="panel-card">

        <h2>
          Alert Escalation Chart
        </h2>

        <ResponsiveContainer
          width="100%"
          height={300}
        >

          <BarChart data={data}>

            <XAxis dataKey="name" />

            <YAxis />

            <Tooltip />

            <Bar
              dataKey="alerts"
              fill="#3b82f6"
            />

          </BarChart>

        </ResponsiveContainer>

      </div>

    </div>

  );

};

export default Phase1;