import React from "react";

import EvidenceTrendChart from "../components/Charts/EvidenceTrendChart";
import EvidenceTypeChart from "../components/Charts/EvidenceTypeChart";

function EvidenceViewTask36() {

  const evidenceData = {
    totalEvidence: 345,
    verifiedEvidence: 302,
    pendingReview: 31,
    rejectedEvidence: 12
  };

  return (
    <div>

      <h1 className="dashboard-title">
        Evidence Management Center
      </h1>

      {/* KPI Cards */}

      <div className="card-grid">

        <div className="card signals">
          <h3>Total Evidence</h3>
          <h2>345</h2>
        </div>

        <div className="card incidents">
          <h3>Verified</h3>
          <h2>302</h2>
        </div>

        <div className="card replay">
          <h3>Pending Review</h3>
          <h2>31</h2>
        </div>

        <div className="card escalations">
          <h3>Rejected</h3>
          <h2>12</h2>
        </div>

      </div>

      {/* Charts */}

      <div className="dashboard-grid">

        <EvidenceTrendChart />

        <EvidenceTypeChart />

      </div>

      {/* Backend Response */}

      {/* <div className="panel">

        <h2>Backend Response</h2>

        <pre
          style={{
            background: "#111827",
            color: "#22c55e",
            padding: "15px",
            borderRadius: "10px"
          }}
        >
          {JSON.stringify(evidenceData, null, 2)}
        </pre>

      </div> */}

      {/* Information */}

      <div className="dashboard-grid">

        <div className="panel">

          <h2>Evidence Information</h2>

          <p>
            Evidence Management stores logs,
            telemetry records, screenshots,
            trace outputs and audit reports.
          </p>

          <br />

          <p>
            Evidence is used for incident
            investigations, compliance reviews
            and operational audits.
          </p>

          <br />

          <p>
            Verified evidence provides trusted
            proof for root cause analysis and
            governance reviews.
          </p>

        </div>

        {/* <div className="panel">

          <h2>Evidence Statistics</h2>

          <p>Total Evidence : 345</p>
          <p>Verified : 302</p>
          <p>Pending Review : 31</p>
          <p>Rejected : 12</p>
          <p>Verification Rate : 87%</p>

        </div> */}

      </div>

      {/* Evidence Repository */}

      <div className="panel">

        <h2>Evidence Repository</h2>

        <table>

          <thead>
            <tr>
              <th>Evidence ID</th>
              <th>Type</th>
              <th>Status</th>
              <th>Owner</th>
            </tr>
          </thead>

          <tbody>

            <tr>
              <td style={{ color: "#000000" }}>EVD-1001</td>
              <td style={{ color: "#000000" }}>Logs</td>
              <td style={{ color: "#000000" }}>Verified</td>
              <td style={{ color: "#000000" }}>Runtime Team</td>
            </tr>

            <tr>
              <td style={{ color: "#000000" }}>EVD-1002</td>
              <td style={{ color: "#000000" }}>Metrics</td>
              <td style={{ color: "#000000" }}>Verified</td>
              <td style={{ color: "#000000" }}>Platform Team</td>
            </tr>

            <tr>
              <td style={{ color: "#000000" }}>EVD-1003</td>
              <td style={{ color: "#000000" }}>Screenshot</td>
              <td style={{ color: "#000000" }}>Pending</td>
              <td style={{ color: "#000000" }}>Operations Team</td>
            </tr>

            <tr>
              <td style={{ color: "#000000" }}>EVD-1004</td>
              <td style={{ color: "#000000" }}>Trace File</td>
              <td style={{ color: "#000000" }}>Verified</td>
              <td style={{ color: "#000000" }}>Replay Team</td>
            </tr>

            <tr>
              <td style={{ color: "#000000" }}>EVD-1005</td>
              <td style={{ color: "#000000" }}>Audit Report</td>
              <td style={{ color: "#000000" }}>Rejected</td>
              <td style={{ color: "#000000" }}>Governance Team</td>
            </tr>

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default EvidenceViewTask36;