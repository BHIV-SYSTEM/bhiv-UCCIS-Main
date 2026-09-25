export default function IncidentSeverity() {
  const severity = [
    ["LOW", 12],
    ["MEDIUM", 8],
    ["HIGH", 4],
    ["CRITICAL", 2]
  ];

  return (
    <div className="panel">
      <h2>Incident Severity Matrix</h2>

      {severity.map((item) => (
        <div className="row" key={item[0]}>
          <span>{item[0]}</span>
          <span>{item[1]}</span>
        </div>
      ))}
    </div>
  );
}