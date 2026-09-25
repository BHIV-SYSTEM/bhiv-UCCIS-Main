export default function RuntimeCards() {
  const cards = [
    {
      title: "Signals",
      value: 120,
    },
    {
      title: "Telemetry",
      value: 95,
    },
    {
      title: "Incidents",
      value: 60,
    },
    {
      title: "Escalations",
      value: 35,
    },
    {
      title: "Replays",
      value: 18,
    },
    {
      title: "Logs",
      value: 450,
    },
  ];

  return (
    <div className="runtime-summary">
      {cards.map((card, index) => (
        <div
          key={index}
          className="summary-card"
        >
          <span>{card.title}</span>

          <strong>{card.value}</strong>
        </div>
      ))}
    </div>
  );
}