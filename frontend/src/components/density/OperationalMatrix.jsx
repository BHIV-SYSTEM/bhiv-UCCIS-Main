export default function OperationalMatrix() {

  return (
    <div className="density-panel">

      <div className="density-header">
        OPERATIONAL MATRIX
      </div>

      <div className="matrix-grid">

        <div className="matrix-card">
          <p>Critical Incidents</p>
          <h3>12</h3>
        </div>

        <div className="matrix-card">
          <p>Field Escalations</p>
          <h3>31</h3>
        </div>

        <div className="matrix-card">
          <p>Execution Load</p>
          <h3>84%</h3>
        </div>

        <div className="matrix-card">
          <p>District Sync</p>
          <h3>92%</h3>
        </div>

      </div>

    </div>
  );
}