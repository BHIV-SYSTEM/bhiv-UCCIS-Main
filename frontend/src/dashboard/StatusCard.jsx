function StatusCard({ title, value }) {
  return (
    <div className="status-card">
      <h3>{title}</h3>
      <h1>{value}</h1>
    </div>
  );
}

export default StatusCard;