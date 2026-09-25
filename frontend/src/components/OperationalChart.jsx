import {

  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer

} from "recharts";

const data = [

  {
    name: "Replay",
    value: 88
  },

  {
    name: "Recovery",
    value: 61
  },

  {
    name: "Telemetry",
    value: 79
  },

  {
    name: "Governance",
    value: 52
  }

];

function OperationalChart() {

  return (

    <div style={panel}>

      <h2>
        Operational Metrics
      </h2>

      <ResponsiveContainer
        width="100%"
        height={300}
      >

        <BarChart data={data}>

          <CartesianGrid
            strokeDasharray="3 3"
          />

          <XAxis dataKey="name" />

          <YAxis />

          <Tooltip />

          <Bar
            dataKey="value"
            fill="#3b82f6"
          />

        </BarChart>

      </ResponsiveContainer>

    </div>

  );

}

const panel = {

  background: "#102030",

  padding: "20px",

  borderRadius: "12px",

  border: "1px solid #1f3b57"
};

export default OperationalChart;