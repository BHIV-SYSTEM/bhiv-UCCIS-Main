export default function IncidentProgression() {

  return (
    <div className="replay-panel">

      <div className="replay-panel-header">
        INCIDENT PROGRESSION
      </div>

      <div className="progress-step completed">
        District Alert Raised
      </div>

      <div className="progress-step completed">
        PS Escalation Approved
      </div>

      <div className="progress-step active">
        Field Execution Active
      </div>

      <div className="progress-step">
        Resolution Validation Pending
      </div>

    </div>
  );
}