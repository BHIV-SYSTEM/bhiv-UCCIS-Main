import React from "react";
import StatCardTask29 from "../components/StatCardTask29";
import ResponseViewer from "../components/ResponseViewer";

import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from "recharts";

function IncidentsTask29({ data }) {

  const floodCount = data.filter(
    item => item.signal_type === "Flood Alert"
  ).length;

  const trafficCount = data.filter(
    item => item.signal_type === "Traffic Incident"
  ).length;

  const medicalCount = data.filter(
    item => item.signal_type === "Medical Emergency"
  ).length;

  const powerCount = data.filter(
    item => item.signal_type === "Power Failure"
  ).length;

  const cyberCount = data.filter(
    item => item.signal_type === "Cyber Incident"
  ).length;

  const totalIncidents = data.length;

  const chartData = [
    {
      name: "Flood",
      value: floodCount
    },
    {
      name: "Traffic",
      value: trafficCount
    },
    {
      name: "Medical",
      value: medicalCount
    },
    {
      name: "Power",
      value: powerCount
    },
    {
      name: "Cyber",
      value: cyberCount
    }
  ];

  const BAR_COLORS = [
    "#ef4444",
    "#f97316",
    "#eab308",
    "#3b82f6",
    "#8b5cf6"
  ];

  const PIE_COLORS = [
    "#dc2626",
    "#ea580c",
    "#ca8a04",
    "#2563eb",
    "#7c3aed"
  ];

  return (
    <>
      <h1 className="page-title">
        Incident Management
      </h1>

      {/* CARDS */}

      <div className="cards-grid">

        <StatCardTask29
          title="Total Incidents"
          value={totalIncidents}
          icon="🚨"
        />

        <StatCardTask29
          title="Flood Incidents"
          value={floodCount}
          icon="🌊"
        />

        <StatCardTask29
          title="Traffic Incidents"
          value={trafficCount}
          icon="🚦"
        />

        <StatCardTask29
          title="Medical Incidents"
          value={medicalCount}
          icon="🏥"
        />

        <StatCardTask29
          title="Power Incidents"
          value={powerCount}
          icon="⚡"
        />

        <StatCardTask29
          title="Cyber Incidents"
          value={cyberCount}
          icon="🔐"
        />

      </div>

      {/* INCIDENT BAR CHART */}

      <div className="chart-card">

        <h2>Incident Volume Analysis</h2>

        <ResponsiveContainer
          width="100%"
          height={350}
        >
          <BarChart data={chartData}>
            <XAxis
  dataKey="name"
  stroke="#cbd5e1"
  label={{
    value: "Incident Type",
    position: "insideBottom",
    offset: -1,
    fill: "#cbd5e1",
  }}
/>

<YAxis
  stroke="#cbd5e1"
  label={{
    value: "Incident Volume",
    angle: -90,
    position: "insideLeft",
    fill: "#cbd5e1",
  }}
/>
            <Tooltip />

            <Bar dataKey="value">
              {chartData.map((entry, index) => (
                <Cell
                  key={index}
                  fill={
                    BAR_COLORS[
                      index %
                      BAR_COLORS.length
                    ]
                  }
                />
              ))}
            </Bar>

          </BarChart>
        </ResponsiveContainer>

      </div>

      {/* INCIDENT PIE CHART */}

      <div className="chart-card">

        <h2>Incident Distribution</h2>

        <ResponsiveContainer
  width="100%"
  height={350}
>
  <PieChart>

    <Pie
      data={chartData}
      dataKey="value"
      nameKey="name"
      outerRadius={120}
      label
    >
      {chartData.map((entry, index) => (
        <Cell
          key={index}
          fill={
            PIE_COLORS[
              index % PIE_COLORS.length
            ]
          }
        />
      ))}
    </Pie>

    <Tooltip />

    <Legend
      verticalAlign="bottom"
      align="center"
      layout="horizontal"
    />

  </PieChart>
</ResponsiveContainer>

      </div>

      {/* INCIDENT TABLE */}

      <div className="content-card">

        <h2>Incidents</h2>

        <table className="data-table">

          <thead>
            <tr>
              <th>ID</th>
              <th>Signal ID</th>
              <th>Incident Type</th>
            </tr>
          </thead>

          <tbody>

            {data.map((item, index) => (
              <tr key={index}>
                <td>{item.id}</td>
                <td>{item.signal_id}</td>
                <td>{item.signal_type}</td>
              </tr>
            ))}

          </tbody>

        </table>

      </div>

      {/* EXISTING BACKEND RESPONSE */}

      {/* <ResponseViewer data={data} /> */}

    </>
  );
}

export default IncidentsTask29;