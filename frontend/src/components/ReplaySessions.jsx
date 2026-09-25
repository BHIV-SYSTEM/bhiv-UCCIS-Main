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

function ReplaySessions({ data }) {

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

  const totalSessions = data.length;

  const chartData = [
    { name: "Flood", value: floodCount },
    { name: "Traffic", value: trafficCount },
    { name: "Medical", value: medicalCount },
    { name: "Power", value: powerCount },
    { name: "Cyber", value: cyberCount }
  ];

  const BAR_COLORS = [
    "#2563eb",
    "#059669",
    "#d97706",
    "#dc2626",
    "#7c3aed"
  ];

  const PIE_COLORS = [
    "#60a5fa",
    "#34d399",
    "#fbbf24",
    "#f87171",
    "#a78bfa"
  ];

  return (
    <>
      <h1 className="page-title">
        Replay Sessions
      </h1>

      {/* CARDS */}

      <div className="cards-grid">

        <StatCard
          title="Total Sessions"
          value={totalSessions}
          icon="🎥"
        />

        <StatCard
          title="Flood Replays"
          value={floodCount}
          icon="🌊"
        />

        <StatCard
          title="Traffic Replays"
          value={trafficCount}
          icon="🚦"
        />

        <StatCard
          title="Medical Replays"
          value={medicalCount}
          icon="🏥"
        />

        <StatCard
          title="Power Replays"
          value={powerCount}
          icon="⚡"
        />

        <StatCard
          title="Cyber Replays"
          value={cyberCount}
          icon="🔐"
        />

      </div>

      {/* BAR CHART */}

      <div className="chart-card">

        <h2>Replay Session Analysis</h2>

        <ResponsiveContainer
          width="100%"
          height={350}
        >
          <BarChart data={chartData}>
            <XAxis
      dataKey="name"
      label={{
        value: "Replay Session",
        position: "insideBottom",
        offset: -5,
      }}
    />

    <YAxis
      label={{
        value: "Number of Replays",
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

        <h2>Replay Distribution</h2>

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
      iconType="circle"
    />

  </PieChart>
</ResponsiveContainer>

      </div>

      {/* TABLE */}

      <div className="content-card">

        <h2>Replay Sessions</h2>

        <table className="data-table">

          <thead>
            <tr>
              <th>ID</th>
              <th>Signal ID</th>
              <th>Replay Scenario</th>
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

export default ReplaySessions;