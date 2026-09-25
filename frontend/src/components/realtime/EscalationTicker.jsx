export default function EscalationTicker() {

  return (
    <div className="escalation-ticker">

      <div className="ticker-live critical">
        P1 • Mumbai Flood Escalation • ACTIVE
      </div>

      <div className="ticker-live">
        Nashik Replay Reconstruction Running
      </div>

      <div className="ticker-live warning">
        2 District ACK Delays Detected
      </div>

      <div className="ticker-live success">
        Telemetry Stream Restored
      </div>

    </div>
  );
}