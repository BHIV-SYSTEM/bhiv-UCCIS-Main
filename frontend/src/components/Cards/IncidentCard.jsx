export default function IncidentCard({
  incidentId,
  traceId,
  severity,
  status
}) {
  return (
    <div className="incident-card">

      <h3>{incidentId}</h3>

      <p>
        Trace : {traceId}
      </p>

      <p>
        Severity : {severity}
      </p>

      <p>
        Status : {status}
      </p>

    </div>
  );
}