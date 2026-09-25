import "./AlertCard.css";

function AlertCardTask38({
  title,
  severity,
  traceId
}) {

  return (
    <div className="alert-card">

      <h4>{title}</h4>

      <p>
        Severity:
        {" "}
        {severity}
      </p>

      <p>
        Trace:
        {" "}
        {traceId}
      </p>

    </div>
  );
}

export default AlertCardTask38;