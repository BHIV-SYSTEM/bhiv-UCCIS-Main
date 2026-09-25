import { useMemo } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell
} from "recharts";

export default function ModuleDrilldown({
  selectedModule
}) {
  const moduleData = useMemo(() => {
    switch (selectedModule) {
      case "Signals":
        return {
          total: 24,
          active: 18,
          critical: 6,
          endpoint: "/api/events?event_type=signal",
          chartData: [
            { name: "Total", value: 24 },
            { name: "Active", value: 18 },
            { name: "Critical", value: 6 }
          ]
        };

      case "Telemetry":
        return {
          total: 16,
          active: 12,
          critical: 4,
          endpoint: "/api/events?event_type=telemetry",
          chartData: [
            { name: "Total", value: 16 },
            { name: "Active", value: 12 },
            { name: "Critical", value: 4 }
          ]
        };

      case "Incidents":
        return {
          total: 8,
          active: 5,
          critical: 3,
          endpoint: "/api/events?event_type=incident",
          chartData: [
            { name: "Total", value: 8 },
            { name: "Active", value: 5 },
            { name: "Critical", value: 3 }
          ]
        };

      case "Escalations":
        return {
          total: 3,
          active: 2,
          critical: 1,
          endpoint: "/api/events?event_type=escalation",
          chartData: [
            { name: "Total", value: 3 },
            { name: "Active", value: 2 },
            { name: "Critical", value: 1 }
          ]
        };

      case "Replay":
        return {
          total: 14,
          active: 12,
          critical: 2,
          endpoint: "/api/events?event_type=replay",
          chartData: [
            { name: "Total", value: 14 },
            { name: "Success", value: 12 },
            { name: "Failed", value: 2 }
          ]
        };

      case "Runtime Logs":
        return {
          total: 156,
          active: 145,
          critical: 11,
          endpoint: "/api/runtime-logs",
          chartData: [
            { name: "Logs", value: 156 },
            { name: "Processed", value: 145 },
            { name: "Errors", value: 11 }
          ]
        };

      case "Evidence":
        return {
          total: 22,
          active: 19,
          critical: 3,
          endpoint: "/api/evidence",
          chartData: [
            { name: "Evidence", value: 22 },
            { name: "Verified", value: 19 },
            { name: "Pending", value: 3 }
          ]
        };

      case "Trace IDs":
        return {
          total: 17,
          active: 15,
          critical: 2,
          endpoint: "/api/traces",
          chartData: [
            { name: "Total", value: 17 },
            { name: "Active", value: 15 },
            { name: "Closed", value: 2 }
          ]
        };

      default:
        return {
          total: 0,
          active: 0,
          critical: 0,
          endpoint: "",
          chartData: []
        };
    }
  }, [selectedModule]);

  return (
    <div className="panel">
      <h1 className="module-title">
        {selectedModule} Operations Center
      </h1>

      {/* Cards */}

      <div className="cards">

        <div
          className="card"
          style={{
            background: "#2563EB",
            color: "white"
          }}
        >
          <h3>
            {selectedModule === "Runtime Logs"
              ? "Logs"
              : selectedModule === "Evidence"
              ? "Evidence"
              : "Total"}
          </h3>

          <h1>{moduleData.total}</h1>
        </div>

        <div
          className="card"
          style={{
            background: "#16A34A",
            color: "white"
          }}
        >
          <h3>
            {selectedModule === "Replay"
              ? "Success"
              : selectedModule === "Runtime Logs"
              ? "Processed"
              : selectedModule === "Evidence"
              ? "Verified"
              : "Active"}
          </h3>

          <h1>{moduleData.active}</h1>
        </div>

        <div
          className="card"
          style={{
            background: "#DC2626",
            color: "white"
          }}
        >
          <h3>
            {selectedModule === "Replay"
              ? "Failed"
              : selectedModule === "Runtime Logs"
              ? "Errors"
              : selectedModule === "Evidence"
              ? "Pending"
              : selectedModule === "Trace IDs"
              ? "Closed"
              : "Critical"}
          </h3>

          <h1>{moduleData.critical}</h1>
        </div>

      </div>

      {/* Chart */}

      {/* Chart */}

<div className="chart-box">

  <h2
    style={{
      textAlign: "center",
      color: "#60A5FA",
      fontSize: "22px",
      marginBottom: "20px",
      fontWeight: "700"
    }}
  >
    {selectedModule} Metrics
  </h2>

  <ResponsiveContainer width="100%" height={360}>
    <BarChart
      data={moduleData.chartData}
      margin={{
        top: 10,
        right: 30,
        left: 0,
        bottom: 5
      }}
    >

      <CartesianGrid
        stroke="#9CA3AF"
        strokeDasharray="4 4"
      />

      <XAxis
  dataKey="name"
  tick={{
    fill: "#808080",
    fontSize: 18
  }}
  tickLine={false}
  axisLine={{
    stroke: "#808080"
  }}
  label={{
    value: "Signal Metric",
    position: "insideBottom",
    offset: -1
  }}
/>

<YAxis
  tick={{
    fill: "#808080",
    fontSize: 18
  }}
  tickLine={false}
  axisLine={{
    stroke: "#808080"
  }}
  label={{
    value: "Metric Value",
    angle: -90,
    position: "insideLeft"
  }}
/>

      <Tooltip
        contentStyle={{
          background: "#1E293B",
          border: "1px solid #334155",
          color: "#fff"
        }}
      />

      <Bar
        dataKey="value"
        barSize={220}
        radius={[4, 4, 0, 0]}
      >
        {moduleData.chartData.map((entry, index) => {

          let color = "#2563EB";

          if (
            entry.name === "Total" ||
            entry.name === "Logs" ||
            entry.name === "Evidence"
          ) {
            color = "#2563EB";
          }

          if (
            entry.name === "Active" ||
            entry.name === "Success" ||
            entry.name === "Processed" ||
            entry.name === "Verified"
          ) {
            color = "#16A34A";
          }

          if (
            entry.name === "Critical" ||
            entry.name === "Failed" ||
            entry.name === "Errors" ||
            entry.name === "Pending" ||
            entry.name === "Closed"
          ) {
            color = "#DC2626";
          }

          return (
            <Cell
              key={index}
              fill={color}
            />
          );
        })}
      </Bar>

    </BarChart>
  </ResponsiveContainer>

</div>

      {/* Endpoint */}

      {/* <div className="panel">
        <h2>Backend Endpoint</h2>

        <pre>{moduleData.endpoint}</pre>
      </div> */}

      {/* Records */}

      <div className="panel">
        <h2>{selectedModule} Records</h2>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Status</th>
              <th>Layer</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td style={{ color: "#000000"}}>001</td>
              <td style={{ color: "#000000"}}>ACTIVE</td>
              <td style={{ color: "#000000"}}>{selectedModule}</td>
            </tr>

            <tr>
              <td style={{ color: "#000000"}}>002</td>
              <td style={{ color: "#000000"}}>ACTIVE</td>
              <td style={{ color: "#000000"}}>{selectedModule}</td>
            </tr>

            <tr>
              <td style={{ color: "#000000"}}>003</td>
              <td style={{ color: "#000000"}}>
                {selectedModule === "Trace IDs"
                  ? "CLOSED"
                  : "CRITICAL"}
              </td>
              <td style={{ color: "#000000"}}>{selectedModule}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}