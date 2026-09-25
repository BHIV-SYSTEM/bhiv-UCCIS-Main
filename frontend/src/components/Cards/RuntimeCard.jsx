import "./RuntimeCard.css";

function RuntimeCard({
  runtime,
  health,
  status
}) {

  return (
    <div className="runtime-card">

      <h3>
        {runtime}
      </h3>

      <h1>
        {health}
      </h1>

      <span>
        {status}
      </span>

    </div>
  );
}

export default RuntimeCard;