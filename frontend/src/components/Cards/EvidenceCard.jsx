export default function EvidenceCard({
  evidenceId,
  fileName,
  type
}) {
  return (
    <div className="evidence-card">

      <h3>{evidenceId}</h3>

      <p>{fileName}</p>

      <p>{type}</p>

    </div>
  );
}