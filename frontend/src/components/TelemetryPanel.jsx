function TelemetryPanel({ telemetry }) {

  return (
    <div className="panel">

      <div className="panel-title">
        TELEMETRY ENTROPY
      </div>

      <div className="executive-line">
        Stale Telemetry:
        {telemetry.staleTelemetry
          ? " DETECTED"
          : " ACTIVE"}
      </div>

      <div className="executive-line">
        Node Stability:
        {telemetry.nodes}
      </div>

      <div className="executive-line">
        Delayed Acknowledgement:
        {telemetry.delayedAcknowledgement
          ? " YES"
          : " NO"}
      </div>

    </div>
  );
}

export default TelemetryPanel;