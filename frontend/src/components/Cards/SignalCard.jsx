export default function SignalCard({
  signalId,
  source,
  severity,
  status
}) {
  return (
    <div className="signal-card">

      <h3>{signalId}</h3>

      <p>
        <strong>Source:</strong>
        {source}
      </p>

      <p>
        <strong>Severity:</strong>
        {severity}
      </p>

      <p>
        <strong>Status:</strong>
        {status}
      </p>

    </div>
  );
}