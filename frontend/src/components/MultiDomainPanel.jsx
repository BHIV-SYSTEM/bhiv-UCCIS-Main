export default function MultiDomainPanel() {
  const domains = [
    { name: "Flood", count: 24 },
    { name: "Traffic", count: 15 },
    { name: "Medical", count: 8 },
    { name: "Power", count: 11 },
    { name: "Cyber", count: 7 },
    { name: "Water", count: 13 }
  ];

  return (
    <div className="panel">
      <h2>Multi Domain Runtime</h2>

      <div className="domain-grid">
        {domains.map((d) => (
          <div className="domain-card" key={d.name}>
            <h3>{d.name}</h3>
            <h1>{d.count}</h1>
          </div>
        ))}
      </div>
    </div>
  );
}