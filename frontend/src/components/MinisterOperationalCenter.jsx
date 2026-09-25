import React from "react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip
} from "recharts";

export default function MinisterOperationalCenter() {

  // =========================
  // DATA
  // =========================

  const escalationData = [
    { district: "Mumbai", value: 28 },
    { district: "Thane", value: 22 },
    { district: "Pune", value: 18 },
    { district: "Nashik", value: 14 }
  ];

  const resolvedData = [
    { day: "Mon", resolved: 22 },
    { day: "Tue", resolved: 34 },
    { day: "Wed", resolved: 48 },
    { day: "Thu", resolved: 62 },
    { day: "Fri", resolved: 74 }
  ];

  const fieldData = [
    { zone: "North", teams: 18, workload: 12 },
    { zone: "South", teams: 24, workload: 18 },
    { zone: "East", teams: 16, workload: 10 },
    { zone: "West", teams: 28, workload: 22 }
  ];

  const healthData = [
    { name: "Healthy", value: 92 },
    { name: "Risk", value: 8 }
  ];

  const COLORS = ["#2563eb", "#dc2626"];

  // =========================
  // CALCULATIONS
  // =========================

  const activeEscalations = escalationData.reduce((a, b) => a + b.value, 0);
  const resolvedIncidents = resolvedData.reduce((a, b) => a + b.resolved, 0);
  const fieldTeams = fieldData.reduce((a, b) => a + b.teams, 0);
  const operationalHealth = healthData[0].value;

  return (
    <div className="min-h-screen bg-gray-100 p-10">

      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-5xl font-bold">
          Ministerial Operational Center
        </h1>
        <p className="text-gray-600 mt-4">
          Statewide governance operational visibility
        </p>
      </div>

      {/* CARDS */}
      <div className="grid grid-cols-4 gap-6 mb-10">

        <div className="bg-white p-6 rounded-2xl shadow-lg">
        <div className="
              w-4
              h-4
              rounded-full
              bg-red-500
              mb-4
            " />
          <p>Active Escalations</p>
          <h2 className="text-5xl font-bold mt-3">{activeEscalations}</h2>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg">
        <div className="
              w-4
              h-4
              rounded-full
              bg-green-500
              mb-4
            " />
          <p>Resolved Incidents</p>
          <h2 className="text-5xl font-bold mt-3">{resolvedIncidents}</h2>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg">
        <div className="
              w-4
              h-4
              rounded-full
              bg-blue-500
              mb-4
            " />
          <p>Field Teams</p>
          <h2 className="text-5xl font-bold mt-3">{fieldTeams}</h2>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg">
        <div className="
              w-4
              h-4
              rounded-full
              bg-purple-500
              mb-4
            " />
          <p>Operational Health</p>
          <h2 className="text-5xl font-bold mt-3">{operationalHealth}%</h2>
        </div>

      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-2 gap-8">

        {/* ESCALATIONS */}
        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold mb-6">
            Active Escalations
          </h2>

          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={escalationData}>
              <XAxis dataKey="district" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#dc2626" radius={[8,8,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* RESOLVED */}
        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold mb-6">
            Resolved Incidents
          </h2>

          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={resolvedData}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="resolved"
                stroke="#16a34a"
                strokeWidth={4}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* FIELD TEAMS (FIXED - NO AREA CHART) */}
        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold mb-6">
            Field Execution Load
          </h2>

          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={fieldData}>
              <XAxis dataKey="zone" />
              <YAxis />
              <Tooltip />

              <Bar dataKey="teams" fill="#2563eb" />
              <Bar dataKey="workload" fill="#f59e0b" />

            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* HEALTH */}
        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold mb-6">
            Operational Health
          </h2>

          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie data={healthData} dataKey="value" outerRadius={120} label>
                {healthData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>

        </div>

      </div>

    </div>
  );
}