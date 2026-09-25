export default function DomainHealth() {
  const domains = [
    ["Flood", "98%"],
    ["Traffic", "95%"],
    ["Medical", "92%"],
    ["Power", "89%"],
    ["Cyber", "94%"],
    ["Water", "97%"]
  ];

  return (
    <div className="panel">
      <h2>Domain Health</h2>

      {domains.map((d) => (
        <div className="row" key={d[0]}>
          <span>{d[0]}</span>
          <span>{d[1]}</span>
        </div>
      ))}
    </div>
  );
}