export default function CommandTicker() {

  return (
    <div className="command-ticker">

      <div className="ticker-item critical">
        P1 • Nashik Escalation • ACK Pending
      </div>

      <div className="ticker-item">
        Pune Telemetry Stable
      </div>

      <div className="ticker-item warning">
        Latency Spike • District Sync Delay
      </div>

      <div className="ticker-item success">
        Replay Reconstruction Completed
      </div>

    </div>
  );
}