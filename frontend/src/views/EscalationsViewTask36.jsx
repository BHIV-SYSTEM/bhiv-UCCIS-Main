import React from "react";

import EscalationTrendChart from "../components/Charts/EscalationTrendChart";
import EscalationPriorityChart from "../components/Charts/EscalationPriorityChart";

function EscalationsViewTask36() {

  const escalationData = {
    totalEscalations: 32,
    openEscalations: 14,
    criticalEscalations: 5,
    resolvedToday: 8
  };

  return (
    <div>

      <h1 className="dashboard-title">
        Escalation Management Center
      </h1>

      <div className="card-grid">

        <div className="card signals">
          <h3>Total Escalations</h3>
          <h2>32</h2>
        </div>

        <div className="card incidents">
          <h3>Open Escalations</h3>
          <h2>14</h2>
        </div>

        <div className="card escalations">
          <h3>Critical</h3>
          <h2>5</h2>
        </div>

        <div className="card replay">
          <h3>Resolved Today</h3>
          <h2>8</h2>
        </div>

      </div>

      <div className="dashboard-grid">

        <EscalationTrendChart />

        <EscalationPriorityChart />

      </div>

      {/* <div className="panel">

        <h2>Backend Response</h2>

        <pre
          style={{
            background: "#111827",
            color: "#22c55e",
            padding: "15px",
            borderRadius: "10px",
            overflowX: "auto"
          }}
        >
          {JSON.stringify(escalationData, null, 2)}
        </pre>

      </div> */}

      <div className="dashboard-grid">

        <div className="panel">

          <h2>Escalation Information</h2>

          <p>
            Escalations represent high-priority issues
            requiring immediate attention from platform,
            runtime and operations teams.
          </p>

          <br />

          <p>
            Escalation workflows ensure critical
            incidents are assigned, tracked and
            resolved within SLA timelines.
          </p>

          <br />

          <p>
            Current escalation handling efficiency
            remains above operational targets.
          </p>

        </div>

        <div className="panel">

          <h2>Escalation Status</h2>

          <table>
            <tbody>

              <tr>
                <td style={{ color: "#000000" }}>Open</td>
                <td style={{ color: "#000000" }}>14</td>
              </tr>

              <tr>
                <td style={{ color: "#000000" }}>Assigned</td>
                <td style={{ color: "#000000" }}>8</td>
              </tr>

              <tr>
                <td style={{ color: "#000000" }}>In Progress</td>
                <td style={{ color: "#000000" }}>5</td>
              </tr>

              <tr>
                <td style={{ color: "#000000" }}>Resolved</td>
                <td style={{ color: "#000000" }}>5</td>
              </tr>

            </tbody>
          </table>

        </div>

      </div>

      <div className="panel">

        <h2>Active Escalations</h2>

        <table>

          <thead>
            <tr>
              <th>Escalation ID</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Owner</th>
            </tr>
          </thead>

          <tbody>

            <tr>
              <td style={{ color: "#000000" }}>ESC-1001</td>
              <td style={{ color: "#000000" }}>Critical</td>
              <td style={{ color: "#000000" }}>Open</td>
              <td style={{ color: "#000000" }}>Runtime Team</td>
            </tr>

            <tr>
              <td style={{ color: "#000000" }}>ESC-1002</td>
              <td style={{ color: "#000000" }}>High</td>
              <td style={{ color: "#000000" }}>Assigned</td>
              <td style={{ color: "#000000" }}>Operations Team</td>
            </tr>

            <tr>
              <td style={{ color: "#000000" }}>ESC-1003</td>
              <td style={{ color: "#000000" }}>Medium</td>
              <td style={{ color: "#000000" }}>In Progress</td>
              <td style={{ color: "#000000" }}>Platform Team</td>
            </tr>

            <tr>
              <td style={{ color: "#000000" }}>ESC-1004</td>
              <td style={{ color: "#000000" }}>Critical</td>
              <td style={{ color: "#000000" }}>Open</td>
              <td style={{ color: "#000000" }}>Infrastructure Team</td>
            </tr>

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default EscalationsViewTask36;