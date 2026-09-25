export default function ScenarioPanel() {

  const scenarios = [
    "Flood",
    "Traffic",
    "Medical",
    "Power Failure",
    "Cyber Incident"
  ];

  return (
    <div className="panel">

      <h3>TTG Scenarios</h3>

      {scenarios.map((s) => (
        <div key={s}>{s}</div>
      ))}

    </div>
  );
}