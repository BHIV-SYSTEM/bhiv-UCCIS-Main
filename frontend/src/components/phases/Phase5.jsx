import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const Phase5 = () => {

  const data = [

    {
      time: "09:00",
      health: 82
    },

    {
      time: "09:15",
      health: 85
    },

    {
      time: "09:30",
      health: 89
    },

    {
      time: "09:45",
      health: 91
    },

    {
      time: "10:00",
      health: 94
    }

  ];

  return (

    <div>

      <h1 className="phase-title">

        PHASE 5 — DASHBOARD CAPABILITY

      </h1>

      <div className="panel-card">

        <h2>
          Operational Health Growth
        </h2>

        <ResponsiveContainer
          width="100%"
          height={350}
        >

          <LineChart data={data}>

            <XAxis dataKey="time" />

            <YAxis />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="health"
              stroke="#22c55e"
              strokeWidth={3}
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

      <div className="primitive-grid">

        <div className="primitive-card">

          <h3>
            ExecutiveCard
          </h3>

          <p>
            Reusable KPI runtime card
          </p>

        </div>

        <div className="primitive-card">

          <h3>
            ReplayCard
          </h3>

          <p>
            Replay continuity surface
          </p>

        </div>

        <div className="primitive-card">

          <h3>
            EscalationCard
          </h3>

          <p>
            Escalation intelligence layer
          </p>

        </div>

      </div>

    </div>

  );

};

export default Phase5;