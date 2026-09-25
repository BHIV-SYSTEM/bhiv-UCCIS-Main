import ReplayConfidencePanel from "./ReplayConfidencePanel";

export default function GovernanceSafeReplay() {

  return (
    <div className="panel">

      <h2>GOVERNANCE SAFE REPLAY</h2>

      <ReplayConfidencePanel />

      <div>
        Replay visibility is informational only.
      </div>

      <div>
        No execution pressure generated.
      </div>

    </div>
  );
}