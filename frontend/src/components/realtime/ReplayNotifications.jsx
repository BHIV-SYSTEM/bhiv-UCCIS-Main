export default function ReplayNotifications() {

  return (
    <div className="rt-panel">

      <div className="rt-header">
        REPLAY RECONSTRUCTION NOTIFICATIONS
      </div>

      <div className="replay-note success-note">
        Replay Reconstruction Completed
      </div>

      <div className="replay-note warning-note">
        Divergence detected in ACK chain
      </div>

      <div className="replay-note success-note">
        Incident timeline synchronized
      </div>

    </div>
  );
}