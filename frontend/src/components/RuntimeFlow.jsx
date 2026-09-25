export default function RuntimeFlow() {
  return (
    <div className="flow-card">

      <h2>
        Operational Chain
      </h2>

      <div className="flow">

        <div className="flow-item">
          Signal
        </div>

        <span>→</span>

        <div className="flow-item">
          Telemetry
        </div>

        <span>→</span>

        <div className="flow-item">
          Incident
        </div>

        <span>→</span>

        <div className="flow-item">
          Escalation
        </div>

        <span>→</span>

        <div className="flow-item">
          Replay
        </div>

        <span>→</span>

        <div className="flow-item">
          Runtime Log
        </div>

      </div>

    </div>
  );
}