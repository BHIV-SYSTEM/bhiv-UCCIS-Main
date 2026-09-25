export default function AlertCard({
  title,
  severity,
  message
}) {
  return (
    <div className="alert-card">

      <h3>{title}</h3>

      <p>
        Severity :
        {severity}
      </p>

      <p>{message}</p>

    </div>
  );
}