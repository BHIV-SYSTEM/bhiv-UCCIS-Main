function StatusCardTask21({ title, value, color }) {
  return (
    <div className={`status-card ${color}`}>

      <h3>{title}</h3>

      <h1>{value}</h1>

    </div>
  );
}

export default StatusCardTask21;