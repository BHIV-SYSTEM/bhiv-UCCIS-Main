export default function IncidentProgression() {

  return (

    <div className="progressionCard">

      <div className="timelineHeader">
        Incident Progression
      </div>

      <div className="progressionFlow">

        <div className="progressionStep">
          Field Alert
        </div>

        <div className="progressionArrow">
          →
        </div>

        <div className="progressionStep">
          District Escalation
        </div>

        <div className="progressionArrow">
          →
        </div>

        <div className="progressionStep">
          Recovery Action
        </div>

        <div className="progressionArrow">
          →
        </div>

        <div className="progressionStep">
          Resolution
        </div>

      </div>

    </div>
  );
}