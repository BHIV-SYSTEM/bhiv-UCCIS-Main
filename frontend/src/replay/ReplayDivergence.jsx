export default function ReplayDivergence() {

  return (

    <div className="divergenceCard">

      <div className="timelineHeader">
        Replay Divergence Visibility
      </div>

      <div className="divergenceBody">

        <div className="divergenceRow">

          <span>Expected Lifecycle</span>

          <span className="stableText">
            Validated
          </span>

        </div>

        <div className="divergenceRow">

          <span>Observed Divergence</span>

          <span className="warningText">
            Minor Delay
          </span>

        </div>

        <div className="divergenceRow">

          <span>Replay Drift</span>

          <span className="criticalText">
            None
          </span>

        </div>

      </div>

    </div>
  );
}