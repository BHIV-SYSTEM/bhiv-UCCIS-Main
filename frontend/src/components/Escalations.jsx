import React from "react";
import StatCard from "../components/StatCard";
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

function Escalations({ data }) {

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

  const totalEscalations = data.length;

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
    "#06b6d4",
    "#22c55e",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6"
  ];

  const PIE_COLORS = [
    "#0891b2",
    "#16a34a",
    "#d97706",
    "#dc2626",
    "#7c3aed"
  ];

  return (
    <>
      <h1 className="page-title">
        Escalation Management
      </h1>

      {/* CARDS */}

      <div className="cards-grid">

        <StatCard
          title="Total Escalations"
          value={totalEscalations}
          icon="📈"
        />

        <StatCard
          title="Flood Escalations"
          value={floodCount}
          icon="🌊"
        />

        <StatCard
          title="Traffic Escalations"
          value={trafficCount}
          icon="🚦"
        />

        <StatCard
          title="Medical Escalations"
          value={medicalCount}
          icon="🏥"
        />

        <StatCard
          title="Power Escalations"
          value={powerCount}
          icon="⚡"
        />

        <StatCard
          title="Cyber Escalations"
          value={cyberCount}
          icon="🔐"
        />

      </div>

      {/* BAR CHART */}

      <div className="chart-card">

        <h2>Escalation Volume Analysis</h2>

        <ResponsiveContainer
          width="100%"
          height={350}
        >
          <BarChart data={chartData}>
            <XAxis
  dataKey="name"
  stroke="#cbd5e1"
  label={{
    value: "Escalation Type",
    position: "insideBottom",
    offset: -5,
    fill: "#cbd5e1",
  }}
/>

<YAxis
  stroke="#cbd5e1"
  label={{
    value: "Escalation Volume",
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

      {/* PIE CHART */}

      <div className="chart-card">

        <h2>Escalation Distribution</h2>

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

      {/* ESCALATION TABLE */}

      <div className="content-card">

        <h2>Escalations</h2>

        <table className="data-table">

          <thead>
            <tr>
              <th>ID</th>
              <th>Signal ID</th>
              <th>Escalation Type</th>
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

      {/* BACKEND RESPONSE */}

      {/* <ResponseViewer data={data} /> */}

    </>
  );
}

export default Escalations;