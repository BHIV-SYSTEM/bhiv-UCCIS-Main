import "./ReplayCard.css";

function ReplayCardTask38({
  replayId,
  status,
  executionTime
}) {

  return (
    <div className="replay-card">

      <h4>
        {replayId}
      </h4>

      <p>
        Status:
        {" "}
        {status}
      </p>

      <p>
        Time:
        {" "}
        {executionTime}s
      </p>

    </div>
  );
}

export default ReplayCardTask38;