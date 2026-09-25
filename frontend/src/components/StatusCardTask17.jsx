export default function StatusCardTask17({
  title,
  value,
  status
}) {
  return (
    <div className="status-card">

      <h3>{title}</h3>

      <h2>{value}</h2>

      <p>{status}</p>

    </div>
  );
}