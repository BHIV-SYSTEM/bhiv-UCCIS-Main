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

function Decisions({ data }) {

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

  const totalDecisions = data.length;

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
    "#0ea5e9",
    "#14b8a6",
    "#f59e0b",
    "#f97316",
    "#8b5cf6"
  ];

  const PIE_COLORS = [
    "#0284c7",
    "#0f766e",
    "#d97706",
    "#ea580c",
    "#7c3aed"
  ];

  return (
    <>
      <h1 className="page-title">
        Decision Management
      </h1>

      {/* CARDS */}

      <div className="cards-grid">

        <StatCard
          title="Total Decisions"
          value={totalDecisions}
          icon="🎯"
        />

        <StatCard
          title="Flood Decisions"
          value={floodCount}
          icon="🌊"
        />

        <StatCard
          title="Traffic Decisions"
          value={trafficCount}
          icon="🚦"
        />

        <StatCard
          title="Medical Decisions"
          value={medicalCount}
          icon="🏥"
        />

        <StatCard
          title="Power Decisions"
          value={powerCount}
          icon="⚡"
        />

        <StatCard
          title="Cyber Decisions"
          value={cyberCount}
          icon="🔐"
        />

      </div>

      {/* BAR CHART */}

      <div className="chart-card">

        <h2>Decision Volume Analysis</h2>

        <ResponsiveContainer
          width="100%"
          height={350}
        >
          <BarChart data={chartData}>
            <XAxis
  dataKey="name"
  label={{
    value: "Decision Type",
    position: "insideBottom",
    offset: -1,
  }}
/>

<YAxis
  label={{
    value: "Number of Decisions",
    angle: -90,
    position: "insideLeft",
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

        <h2>Decision Distribution</h2>

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

      {/* DECISIONS TABLE */}

      <div className="content-card">

        <h2>Decisions</h2>

        <table className="data-table">

          <thead>
            <tr>
              <th>ID</th>
              <th>Signal ID</th>
              <th>Decision Type</th>
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

      {/* KEEP EXISTING BACKEND RESPONSE */}

      {/* <ResponseViewer data={data} /> */}

    </>
  );
}

export default Decisions;