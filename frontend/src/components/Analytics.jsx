import React from "react";

import CustomBarChart from "../components/Charts/BarChart";
import CustomLineChart from "../components/Charts/LineChart";
import CustomPieChart from "../components/Charts/PieChart";

function Analytics() {
  const data = [
    { name: "Signals", value: 13 },
    { name: "Telemetry", value: 13 },
    { name: "Incidents", value: 11 },
    { name: "Logs", value: 11 }
  ];

  return (
    <>
      <h2>Analytics</h2>

      <div
        style={{
          background: "white",
          padding: "20px",
          borderRadius: "12px",
          marginBottom: "20px"
        }}
      >
        <CustomBarChart data={data} />
      </div>

      <div
        style={{
          background: "white",
          padding: "20px",
          borderRadius: "12px",
          marginBottom: "20px"
        }}
      >
        <CustomLineChart data={data} />
      </div>

      <div
        style={{
          background: "white",
          padding: "20px",
          borderRadius: "12px"
        }}
      >
        <CustomPieChart data={data} />
      </div>
    </>
  );
}

export default Analytics;