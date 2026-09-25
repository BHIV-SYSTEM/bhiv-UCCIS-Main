export default function LiveTelemetryPanel() {

  return (
    <div className="density-panel">

      <div className="density-header">
        LIVE TELEMETRY
      </div>

      <div className="telemetry-card">
        Replay Sync: ACTIVE
      </div>

      <div className="telemetry-card">
        Signal Latency: 42ms
      </div>

      <div className="telemetry-card">
        Execution Aging: LOW
      </div>

      <div className="telemetry-card">
        Field Heartbeat: STABLE
      </div>

    </div>
  );
}