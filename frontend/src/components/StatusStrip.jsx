function StatusStrip({ telemetry }) {

  return (
    <div className="status-strip">

      <div className="status-card">
        <div className="label">CPU LOAD</div>
        <div className="value">
          {telemetry.cpu}%
        </div>
      </div>

      <div className="status-card">
        <div className="label">MEMORY</div>
        <div className="value">
          {telemetry.memory}%
        </div>
      </div>

      <div className="status-card">
        <div className="label">NODE STATE</div>
        <div className="value">
          {telemetry.nodes}
        </div>
      </div>

      <div className="status-card">
        <div className="label">ACK DELAY</div>
        <div className="value">
          {telemetry.delayedAcknowledgement
            ? "YES"
            : "NO"}
        </div>
      </div>

    </div>
  );
}

export default StatusStrip;