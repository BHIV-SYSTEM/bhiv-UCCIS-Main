export default function TelemetryHealth() {

  return (
    <div className="rt-panel">

      <div className="rt-header">
        TELEMETRY HEALTH
      </div>

      <div className="telemetry-good">
        District Sync Stable
      </div>

      <div className="telemetry-warning">
        2 stale telemetry streams
      </div>

      <div className="telemetry-good">
        Replay Signals Healthy
      </div>

      <div className="telemetry-warning">
        Pune heartbeat latency elevated
      </div>

    </div>
  );
}