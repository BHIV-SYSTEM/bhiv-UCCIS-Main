const OperationalHealth = () => {
  return (
    <div className="panel-card health-panel">

      <h2>OPERATIONAL HEALTH SCORE</h2>

      <div className="health-score">
        91%
      </div>

      <div className="health-grid">

        <div className="health-item">
          <span>Transport</span>
          <strong>Stable</strong>
        </div>

        <div className="health-item">
          <span>Healthcare</span>
          <strong>Operational</strong>
        </div>

        <div className="health-item">
          <span>Utilities</span>
          <strong>Elevated</strong>
        </div>

      </div>

    </div>
  );
};

export default OperationalHealth;