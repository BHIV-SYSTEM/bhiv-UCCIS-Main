export default function CompactCard({ title, value }) {

  return (
    <div className="compact-card">
      <p>{title}</p>
      <h3>{value}</h3>
    </div>
  );
}