export default function ReplayTimeline() {

  const timeline = [
    "08:14 — Incident Triggered",
    "08:16 — District Escalation",
    "08:21 — Field Acknowledged",
    "08:27 — Replay Reconstruction",
    "08:41 — Resolution Logged"
  ];

  return (
    <div className="replay-panel">

      <div className="replay-panel-header">
        REPLAY TIMELINE
      </div>

      {timeline.map((item, index) => (
        <div className="timeline-event" key={index}>
          {item}
        </div>
      ))}

    </div>
  );
}