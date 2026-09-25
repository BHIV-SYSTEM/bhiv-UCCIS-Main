export default function StatCardTask28({
  title,
  value
}) {
  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: "15px",
        width: "180px"
      }}
    >
      <h3>{title}</h3>
      <h2>{value || 0}</h2>
    </div>
  );
}