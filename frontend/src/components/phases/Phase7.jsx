const Phase7 = () => {

  return (

    <div>

      <h1 className="phase-title">

        PHASE 7 — INTEGRATION EXPANSION

      </h1>

      <div className="panel-card">

        <h2>
          Integrated Operational Chain
        </h2>

        <div className="chain-grid">

          <div className="chain-box">
            SIGNAL
          </div>

          <div className="chain-arrow">
            →
          </div>

          <div className="chain-box">
            TELEMETRY
          </div>

          <div className="chain-arrow">
            →
          </div>

          <div className="chain-box">
            ESCALATION
          </div>

          <div className="chain-arrow">
            →
          </div>

          <div className="chain-box">
            DASHBOARD
          </div>

          <div className="chain-arrow">
            →
          </div>

          <div className="chain-box">
            REPLAY
          </div>

        </div>

      </div>

      <div className="panel-card">

        <h2>
          Runtime Integration Proof
        </h2>

        <ul className="phase-list">

          <li>
            Signal connected to telemetry
          </li>

          <li>
            Telemetry connected to escalation
          </li>

          <li>
            Escalation connected to replay
          </li>

          <li>
            Replay connected to operational visibility
          </li>

        </ul>

      </div>

    </div>

  );

};

export default Phase7;