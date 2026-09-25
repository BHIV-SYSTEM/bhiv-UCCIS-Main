import React from "react";

export default function SignalsExtra() {
  const incidents = [
    {
      id: "INC001",
      type: "Fire",
      district: "Nashik",
      severity: "High",
      status: "Active",
    },
    {
      id: "INC002",
      type: "Flood",
      district: "Pune",
      severity: "Medium",
      status: "Resolved",
    },
    {
      id: "INC003",
      type: "Cyber",
      district: "Mumbai",
      severity: "Critical",
      status: "Escalated",
    },
  ];

  const logs = [
    "Signal SIG001 received from Nashik",
    "Telemetry event created",
    "Incident INC001 generated",
    "Escalation triggered",
    "Replay session REP001 started",
    "Runtime log stored successfully",
  ];

  return (
    <>
      {/* Database Statistics */}

      <div className="analytics-grid">
        <div className="analytics-card">
          <h3>Telemetry Events</h3>
          <h2>950</h2>
        </div>

        <div className="analytics-card">
          <h3>Incidents</h3>
          <h2>210</h2>
        </div>

        <div className="analytics-card">
          <h3>Escalations</h3>
          <h2>84</h2>
        </div>

        <div className="analytics-card">
          <h3>Decisions</h3>
          <h2>67</h2>
        </div>

        <div className="analytics-card">
          <h3>Replay Sessions</h3>
          <h2>45</h2>
        </div>

        <div className="analytics-card">
          <h3>Runtime Logs</h3>
          <h2>2350</h2>
        </div>
      </div>

      {/* Operational Flow */}

      <div className="flow-card">
        <h2>Operational Chain</h2>

        <div className="flow">
          <div className="flow-item">Signal</div>
          <div className="flow-item">Telemetry</div>
          <div className="flow-item">Incident</div>
          <div className="flow-item">Escalation</div>
          <div className="flow-item">Decision</div>
          <div className="flow-item">Approval</div>
          <div className="flow-item">Replay</div>
          <div className="flow-item">Runtime Log</div>
        </div>
      </div>

      {/* Recent Incidents */}

      <div className="signal-table-card">
        <h2>Recent Incidents</h2>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Type</th>
              <th>District</th>
              <th>Severity</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {incidents.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.type}</td>
                <td>{item.district}</td>
                <td>{item.severity}</td>
                <td>{item.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* District Summary */}

      <div className="location-card">
        <h2>District Monitoring</h2>

        <div className="location-item">
          <span>Nashik</span>
          <span>32 Signals</span>
        </div>

        <div className="location-item">
          <span>Pune</span>
          <span>28 Signals</span>
        </div>

        <div className="location-item">
          <span>Mumbai</span>
          <span>45 Signals</span>
        </div>

        <div className="location-item">
          <span>Nagpur</span>
          <span>15 Signals</span>
        </div>
      </div>

      {/* Runtime Logs */}

      <div className="backend-card">
        <h2>Live Runtime Logs</h2>

        <pre>
          {logs.map((log, index) => (
            <div key={index}>{log}</div>
          ))}
        </pre>
      </div>

      {/* API Response */}

      <div className="backend-card">
        <h2>Backend API Response</h2>

        <pre>
{JSON.stringify(
{
  success: true,
  signals: 120,
  active: 65,
  critical: 18,
  resolved: 37,
  telemetryEvents: 950,
  incidents: 210
},
null,
2
)}
        </pre>
      </div>
    </>
  );
}