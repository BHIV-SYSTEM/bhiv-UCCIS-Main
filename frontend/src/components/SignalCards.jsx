export default function SignalCards() {
  const cards = [
    {
      title: "Total Signals",
      value: 120,
      color: "#2563eb"
    },
    {
      title: "Active Signals",
      value: 65,
      color: "#16a34a"
    },
    {
      title: "Critical Signals",
      value: 18,
      color: "#dc2626"
    },
    {
      title: "Resolved Signals",
      value: 37,
      color: "#f59e0b"
    }
  ];

  return (
    <div className="signal-cards">
      {cards.map((card, index) => (
        <div
          key={index}
          className="signal-card-box"
          style={{ borderTop: `5px solid ${card.color}` }}
        >
          <h3>{card.title}</h3>
          <h1>{card.value}</h1>
          {/* <p>Live Monitoring</p> */}
        </div>
      ))}
    </div>
  );
}