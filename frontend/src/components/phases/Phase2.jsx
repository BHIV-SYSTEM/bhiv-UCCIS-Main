import {
  PieChart,
  Pie,
  Cell,
  Tooltip
} from "recharts";

const Phase2 = () => {

  const data = [

    {
      name: "Operational",
      value: 70
    },

    {
      name: "Elevated",
      value: 20
    },

    {
      name: "Critical",
      value: 10
    }

  ];

  return (

    <div>

      <h1 className="phase-title">
        PHASE 2 — FEATURE GROWTH
      </h1>

      <div className="panel-card">

        <PieChart
          width={400}
          height={300}
        >

          <Pie
            data={data}
            dataKey="value"
            outerRadius={100}
          >

            <Cell fill="#22c55e" />

            <Cell fill="#facc15" />

            <Cell fill="#ef4444" />

          </Pie>

          <Tooltip />

        </PieChart>

      </div>

    </div>

  );

};

export default Phase2;