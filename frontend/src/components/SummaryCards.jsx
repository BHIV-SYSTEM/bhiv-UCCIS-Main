function SummaryCards({ summary }) {
  const cards = [
    {
      title: "Signals",
      value: 13,
    },

    {
      title: "Telemetry",
      value: 13,
    },

    {
      title: "Incidents",
      value: 11,
    },

    {
      title: "Escalations",
      value: 35,
    },

    {
      title: "Replay",
      value: 18,
    },

    {
      title: "Evidence",
      value: 450,
    },
  ];

  return (
    <div className="card-grid">

      {cards.map((card) => (
        <div
          key={card.title}
          className="summary-card"
        >
          <h3>{card.title}</h3>

          <h1>{card.value}</h1>
        </div>
      ))}

    </div>
  );
}

export default SummaryCards;