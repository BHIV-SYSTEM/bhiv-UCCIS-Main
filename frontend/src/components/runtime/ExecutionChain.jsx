const ExecutionChain = () => {

  return (

    <div className="panel-card">

      <h2>
        SIGNAL → EXECUTION FLOW
      </h2>

      <div className="governance-row">

        <span>
          SIGNAL
        </span>

        <p>
          Flood Detection Triggered
        </p>

      </div>

      <div className="governance-row">

        <span>
          TELEMETRY
        </span>

        <p>
          Water Level Increased
        </p>

      </div>

      <div className="governance-row">

        <span>
          ESCALATION
        </span>

        <p>
          Mumbai Escalation Activated
        </p>

      </div>

      <div className="governance-row">

        <span>
          REPLAY
        </span>

        <p>
          Replay Continuity Verified
        </p>

      </div>

    </div>

  );

};

export default ExecutionChain;