import React from "react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

function TelemetryPage() {

  const telemetryTrend = [
    { time: "10:00", signals: 20 },
    { time: "10:05", signals: 35 },
    { time: "10:10", signals: 40 },
    { time: "10:15", signals: 55 },
    { time: "10:20", signals: 70 }
  ];

  const signalDistribution = [
    {
      signalType: "WasteOverflow",
      count: 48
    },
    {
      signalType: "Traffic",
      count: 35
    },
    {
      signalType: "WaterLeakage",
      count: 28
    },
    {
      signalType: "StreetLight",
      count: 17
    }
  ];

  const recentEvents = [
    {
      id: 1,
      signal: "WasteOverflow",
      event: "SIGNAL_RECEIVED",
      status: "SUCCESS"
    },
    {
      id: 2,
      signal: "TrafficCongestion",
      event: "SIGNAL_RECEIVED",
      status: "SUCCESS"
    },
    {
      id: 3,
      signal: "WaterLeakage",
      event: "SIGNAL_RECEIVED",
      status: "SUCCESS"
    }
  ];

  return (
    <div>

      {/* KPI CARDS */}

      <div className="card-grid">

        <div className="metric-card">
          <h2>128</h2>
          <p>Total Signals</p>
        </div>

        <div className="metric-card">
          <h2>12</h2>
          <p>Active Streams</p>
        </div>

        <div className="metric-card">
          <h2>4.2 MB/s</h2>
          <p>Data Rate</p>
        </div>

        <div className="metric-card">
          <h2>3</h2>
          <p>Anomalies</p>
        </div>

      </div>

      {/* TELEMETRY TREND */}

      <div className="chart-card">

        <h2>📡 Telemetry Trend</h2>

        <ResponsiveContainer
          width="100%"
          height={350}
        >

          <BarChart data={telemetryTrend}>

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="time"
            label={{
    value: "Time",
    position: "insideBottom",
    offset: -5,
  }}
             />

            <YAxis
  label={{
    value: "Signal Count",
    angle: -90,
    position: "insideLeft",
  }}
/>

            <Tooltip />

            <Bar 
            dataKey="signals" 
            fill="#3B82F6"
            />

          </BarChart>

        </ResponsiveContainer>

      </div>

      {/* SIGNAL DISTRIBUTION */}

      <div className="chart-card">

        <h2>📊 Signal Distribution</h2>

        <ResponsiveContainer
          width="100%"
          height={350}
        >

          <BarChart
            data={signalDistribution}
          >

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
              dataKey="signalType"
              label={{
    value: "Signal Type",
    position: "insideBottom",
    offset: -5,
  }}
            />

            <YAxis
  label={{
    value: "Signal Count",
    angle: -90,
    position: "insideLeft",
  }}
/>

            <Tooltip />

            <Bar 
            dataKey="count" 
            fill="#22C55E"
            radius={[8, 8, 0, 0]}
            />

          </BarChart>

        </ResponsiveContainer>

      </div>

      {/* RUNTIME HEALTH */}

      {/* <div className="chart-card">

        <h2>⚙ Runtime Health</h2>

        <div className="card-grid">

          <div className="metric-card">
            <h2>ONLINE</h2>
            <p>Backend</p>
          </div>

          <div className="metric-card">
            <h2>CONNECTED</h2>
            <p>Database</p>
          </div>

          <div className="metric-card">
            <h2>ACTIVE</h2>
            <p>Telemetry Engine</p>
          </div>

          <div className="metric-card">
            <h2>READY</h2>
            <p>Replay Engine</p>
          </div>

        </div>

      </div> */}

      {/* BACKEND RESPONSE */}

      <div className="chart-card">

        <h2>🗄 Backend Response</h2>

        <table className="runtime-table" style={{ color: "#000000" }}>

          <thead>
            <tr>
              <th>ID</th>
              <th>Signal</th>
              <th>Event</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>

            {recentEvents.map(
              (event) => (
                <tr key={event.id}>
                  <td style={{ color: "#000000" }}>{event.id}</td>
                  <td style={{ color: "#000000" }}>{event.signal}</td>
                  <td style={{ color: "#000000" }}>{event.event}</td>
                  <td style={{ color: "#000000" }}>{event.status}</td>
                </tr>
              )
            )}

          </tbody>

        </table>

      </div>

      {/* RECENT EVENTS */}

      <div className="chart-card">

        <h2>📜 Recent Telemetry Events</h2>

        <table className="runtime-table" style={{ color: "#000000" }}>

          <thead>
            <tr>
              <th>ID</th>
              <th>Signal</th>
              <th>Event</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>

            {recentEvents.map(
              (event) => (
                <tr key={event.id}>
                  <td style={{ color: "#000000" }}>{event.id}</td>
                  <td style={{ color: "#000000" }}>{event.signal}</td>
                  <td style={{ color: "#000000" }}>{event.event}</td>
                  <td style={{ color: "#000000" }}>{event.status}</td>
                </tr>
              )
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default TelemetryPage;