export default function IngestionHealth({
  ingestion
}) {
  return (
    <div className="card">
      <h2>Ingestion Health</h2>

      <p>
        Pipeline:
        {ingestion.ingestion_pipeline}
      </p>

      <p>
        Replay Safe:
        {String(
          ingestion.replay_safe
        )}
      </p>
    </div>
  );
}