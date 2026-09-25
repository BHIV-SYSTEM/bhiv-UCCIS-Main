export default function ActiveOperations() {
  const operations = [
    { trace: "TRACE-1001", domain: "Flood", status: "ACTIVE" },
    { trace: "TRACE-1002", domain: "Traffic", status: "ACTIVE" },
    { trace: "TRACE-1003", domain: "Medical", status: "ESCALATED" },
    { trace: "TRACE-1004", domain: "Cyber", status: "REPLAYING" }
  ];

  return (
    <div className="panel">
      <h2>Active Operations</h2>

      {operations.map((op) => (
        <div className="row" key={op.trace}>
          <span>{op.trace}</span>
          <span>{op.domain}</span>
          <span>{op.status}</span>
        </div>
      ))}
    </div>
  );
}