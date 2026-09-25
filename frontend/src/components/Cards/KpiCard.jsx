export default function KpiCard({
  title,
  value,
  color = "#2563eb"
}) {
  return (
    <div
      className="kpi-card"
      style={{
        borderLeft: `5px solid ${color}`
      }}
    >
      <h4>{title}</h4>

      <h2>{value}</h2>
    </div>
  );
}