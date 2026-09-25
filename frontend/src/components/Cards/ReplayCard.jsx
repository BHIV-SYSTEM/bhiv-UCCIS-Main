export default function ReplayCard({
  replayId,
  traceId,
  duration,
  status
}) {
  return (
    <div className="replay-card">

      <h3>{replayId}</h3>

      <p>
        Trace : {traceId}
      </p>

      <p>
        Duration : {duration}
      </p>

      <p>
        Status : {status}
      </p>

    </div>
  );
}