import Header from "../components/Header";

export default function EscalationVisibility() {

  const escalationData = [
    22,
    38,
    57,
    73,
    91,
    64
  ];

  return (

    <div className="page-container">

      {/* PAGE HEADER */}

      <Header title="Escalation Visibility" />

      {/* TOP STATUS STRIP */}

      <div className="top-status-strip">

        <div className="status-pill warning-pill">
          Critical Escalations
        </div>

        <div className="status-pill">
          Visibility Stable
        </div>

        <div className="status-pill">
          Executive Monitoring Active
        </div>

        <div className="status-pill">
          Recovery Oversight Enabled
        </div>

      </div>

      {/* STATUS CARDS */}

      <div className="executive-grid">

        {/* ACTIVE ESCALATIONS */}

        <div className="executive-card">

          <h4>Active Escalations</h4>

          <h1>91</h1>

          <span className="danger">
            Critical Governance Alerts
          </span>

        </div>

        {/* RESPONSE SPEED */}

        <div className="executive-card">

          <h4>Response Speed</h4>

          <h1>64%</h1>

          <span className="warning">
            Escalation Handling Delayed
          </span>

        </div>

        {/* VISIBILITY INDEX */}

        <div className="executive-card">

          <h4>Visibility Index</h4>

          <h1>88%</h1>

          <span className="positive">
            Executive Monitoring Active
          </span>

        </div>

        {/* RECOVERY CONFIDENCE */}

        <div className="executive-card">

          <h4>Recovery Confidence</h4>

          <h1>81%</h1>

          <span className="positive">
            Stabilization In Progress
          </span>

        </div>

      </div>

      {/* ESCALATION ENGINE */}

      <div className="page-card">

        <h2>
          Escalation Visibility Engine
        </h2>

        <p>
          Governance escalation signals detected across operational districts.
        </p>

        <p>
          Critical incidents propagated into executive visibility channels.
        </p>

        <p>
          Delayed response behavior identified in regional coordination layers.
        </p>

        <p>
          Escalation tracking confidence stabilized at 88%.
        </p>

        <p>
          Executive continuity visibility maintained successfully.
        </p>

      </div>

      {/* ESCALATION CHART */}

      <div className="chart-card">

        <div className="chart-title">
          Escalation Intensity Trend
        </div>

        <div className="custom-chart">

          {
            escalationData.map((item, index) => (

              <div
                key={index}
                className="bar-wrapper"
              >

                <div
                  className="bar"
                  style={{
                    height: `${item * 3}px`
                  }}
                ></div>

                <span>
                  {item}%
                </span>

              </div>

            ))
          }

        </div>

      </div>

      {/* BACKEND RESPONSE */}

      <div className="backend-response">

        <h2>
          Backend API Response
        </h2>

        <pre>
{`
GET /api/escalation/status

{
  "active_escalations": 91,
  "response_speed": "64%",
  "visibility_index": "88%",
  "priority_level": "critical"
}

POST /api/escalation/resolve

{
  "message": "Escalation recovery initiated",
  "resolution_confidence": "81%",
  "status": "monitoring"
}
`}
        </pre>

      </div>

      {/* RUNTIME LOGS */}

      <div className="log-panel">

        <h3>
          Escalation Runtime Logs
        </h3>

        <div className="log-item danger-log">
          15:01 Critical escalation triggered
        </div>

        <div className="log-item">
          15:03 Executive notification dispatched
        </div>

        <div className="log-item warning-log">
          15:04 Regional coordination delayed
        </div>

        <div className="log-item danger-log">
          15:06 Escalation priority increased
        </div>

        <div className="log-item">
          15:08 Recovery oversight activated
        </div>

        <div className="log-item positive-log">
          15:10 Governance visibility stabilized
        </div>

      </div>

    </div>

  );
}