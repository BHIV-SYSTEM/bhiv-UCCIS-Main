export default function EvidencePanelTask35() {
  const evidence = [
    "EV-001",
    "EV-002",
    "EV-003",
    "EV-004"
  ];

  return (
    <div className="panel">
      <h2>Evidence Records</h2>

      {evidence.map((item) => (
        <div className="row" key={item}>
          {item}
        </div>
      ))}
    </div>
  );
}