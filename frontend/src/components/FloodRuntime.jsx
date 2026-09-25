import React from "react";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
} from "recharts";

import "./Runtime.css";

const FloodRuntime = () => {
  const telemetry = [
    {
      zone: "River Zone",
      latency: 120,
    },

    {
      zone: "Dam Sector",
      latency: 145,
    },

    {
      zone: "Bridge Sector",
      latency: 180,
    },

    {
      zone: "Drainage Grid",
      latency: 160,
    },
  ];

  const escalation = [
    {
      sector: "Pune Central",
      count: 12,
    },

    {
      sector: "Baner",
      count: 7,
    },

    {
      sector: "Kothrud",
      count: 9,
    },

    {
      sector: "Hadapsar",
      count: 14,
    },
  ];

  return (
    <div className="runtime-page">
      <h1>
        Flood Simulation Runtime
      </h1>

      <p>
        TTG flood escalation
        scenario with telemetry
        degradation and replay
        participation.
      </p>

      <div className="runtime-grid">
        <div className="runtime-card">
          <h2>
            Telemetry Latency
          </h2>

          <ResponsiveContainer
            width="100%"
            height={300}
          >
            <LineChart
              data={telemetry}
            >
              <CartesianGrid
                strokeDasharray="3 3"
              />

              <XAxis dataKey="zone" />

              <YAxis />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="latency"
                stroke="#3b82f6"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="runtime-card">
          <h2>
            Escalation Overview
          </h2>

          <ResponsiveContainer
            width="100%"
            height={300}
          >
            <BarChart
              data={escalation}
            >
              <CartesianGrid
                strokeDasharray="3 3"
              />

              <XAxis dataKey="sector" />

              <YAxis />

              <Tooltip />

              <Bar
                dataKey="count"
                fill="#ef4444"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="info-card">
        <h2>
          Operational Summary
        </h2>

        <ul>
          <li>
            Flood telemetry
            degradation detected
          </li>

          <li>
            Replay engine activated
          </li>

          <li>
            Escalation chain
            operational
          </li>

          <li>
            Runtime visibility
            active
          </li>
        </ul>
      </div>
    </div>
  );
};

export default FloodRuntime;