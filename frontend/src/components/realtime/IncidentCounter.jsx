export default function IncidentCounter() {

  return (
    <div className="rt-panel">

      <div className="rt-header">
        ACTIVE INCIDENT COUNTERS
      </div>

      <div className="incident-grid">

        <div className="incident-box">
          <p>Critical</p>
          <h2>12</h2>
        </div>

        <div className="incident-box">
          <p>High</p>
          <h2>31</h2>
        </div>

        <div className="incident-box">
          <p>Medium</p>
          <h2>84</h2>
        </div>

        <div className="incident-box">
          <p>Resolved</p>
          <h2>219</h2>
        </div>

      </div>

    </div>
  );
}