import React from "react";

import IncidentTrendChartTask36 from "../components/Charts/IncidentTrendChartTask36";
import IncidentSeverityChart from "../components/Charts/IncidentSeverityChart";

function IncidentsViewTask36() {
  const incidentData = {
    totalIncidents: 76,
    openIncidents: 18,
    criticalIncidents: 6,
    resolvedToday: 17
  };

  return (
    <div>

      <h1 className="dashboard-title">
        Incident Management Center
      </h1>

      {/* KPI Cards */}

      <div className="card-grid">

        <div className="card signals">
          <h3>Total Incidents</h3>
          <h2>76</h2>
        </div>

        <div className="card incidents">
          <h3>Open Incidents</h3>
          <h2>18</h2>
        </div>

        <div className="card escalations">
          <h3>Critical</h3>
          <h2>6</h2>
        </div>

        <div className="card replay">
          <h3>Resolved Today</h3>
          <h2>17</h2>
        </div>

      </div>

      {/* Charts */}

      <div className="dashboard-grid">

        <IncidentTrendChartTask36 />

        <IncidentSeverityChart />

      </div>

      {/* Backend Response */}

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
          {JSON.stringify(incidentData, null, 2)}
        </pre>

      </div> */}

      {/* Information */}

      <div className="dashboard-grid">

        <div className="panel">

          <h2>Incident Information</h2>

          <p>
            Incidents represent operational issues,
            service disruptions and failures detected
            across the UCCIS platform.
          </p>

          <br />

          <p>
            Incident management ensures rapid
            investigation, escalation and resolution
            of production issues.
          </p>

          <br />

          <p>
            Critical incidents are continuously
            monitored until closure and post-incident
            review completion.
          </p>

        </div>

        <div className="panel">

          <h2>Incident Status Overview</h2>

          <table>

            <tbody>

              <tr>
                <td style={{ color: "#000000" }}>Open</td>
                <td style={{ color: "#000000" }}>18</td>
              </tr>

              <tr>
                <td style={{ color: "#000000" }}>Investigating</td>
                <td style={{ color: "#000000" }}>12</td>
              </tr>

              <tr>
                <td style={{ color: "#000000" }}>Escalated</td>
                <td style={{ color: "#000000" }}>6</td>
              </tr>

              <tr>
                <td style={{ color: "#000000" }}>Resolved</td>
                <td style={{ color: "#000000" }}>40</td>
              </tr>

            </tbody>

          </table>

        </div>

      </div>

      {/* Open Incidents */}

      <div className="panel">

        <h2>Open Incidents</h2>

        <table>

          <thead>

            <tr>
              <th>Incident ID</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Owner</th>
            </tr>

          </thead>

          <tbody>

            <tr>
              <td style={{ color: "#000000" }}>INC-1001</td>
              <td style={{ color: "#000000" }}>Critical</td>
              <td style={{ color: "#000000" }}>Open</td>
              <td style={{ color: "#000000" }}>Runtime Team</td>
            </tr>

            <tr>
              <td style={{ color: "#000000" }}>INC-1002</td>
              <td style={{ color: "#000000" }}>High</td>
              <td style={{ color: "#000000" }}>Investigating</td>
              <td style={{ color: "#000000" }}>Operations Team</td>
            </tr>

            <tr>
              <td style={{ color: "#000000" }}>INC-1003</td>
              <td style={{ color: "#000000" }}>Medium</td>
              <td style={{ color: "#000000" }}>Escalated</td>
              <td style={{ color: "#000000" }}>Platform Team</td>
            </tr>

            <tr>
              <td style={{ color: "#000000" }}>INC-1004</td>
              <td style={{ color: "#000000" }}>Low</td>
              <td style={{ color: "#000000" }}>Open</td>
              <td style={{ color: "#000000" }}>Support Team</td>
            </tr>

            <tr>
              <td style={{ color: "#000000" }}>INC-1005</td>
              <td style={{ color: "#000000" }}>Critical</td>
              <td style={{ color: "#000000" }}>Investigating</td>
              <td style={{ color: "#000000" }}>Runtime Team</td>
            </tr>

          </tbody>

        </table>

      </div>

      {/* Statistics */}

      {/* <div className="dashboard-grid">

        <div className="panel">

          <h2>Incident Statistics</h2>

          <p>Total Incidents : 76</p>
          <p>Open Incidents : 18</p>
          <p>Critical Incidents : 6</p>
          <p>Resolved Today : 17</p>
          <p>Average Resolution Time : 4.2 Hours</p>

        </div>

        <div className="panel">

          <h2>Operational Summary</h2>

          <p>Runtime Related : 28</p>
          <p>Telemetry Related : 16</p>
          <p>Infrastructure Related : 14</p>
          <p>Security Related : 10</p>
          <p>Analytics Related : 8</p>

        </div>

      </div> */}

    </div>
  );
}

export default IncidentsViewTask36;