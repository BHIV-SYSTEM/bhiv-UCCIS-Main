import useRuntimeDataTask34 from "../hooks/useRuntimeDataTask34";

function SummaryCardsTask34() {
  const { loading, data } = useRuntimeDataTask34();

  console.log("Dashboard Data:", data);

  if (loading) {
    return (
      <div className="panel">
        <h3>Loading Dashboard...</h3>
      </div>
    );
  }

  const cards = [
    {
      title: "Signals",
      value: data?.signals ?? 12,
      className: "signals-card",
    },
    {
      title: "Telemetry",
      value: data?.telemetry ?? 25,
      className: "telemetry-card",
    },
    {
      title: "Incidents",
      value: data?.incidents ?? 10,
      className: "incidents-card",
    },
    {
      title: "Escalations",
      value: data?.escalations ?? 12,
      className: "escalations-card",
    },
    {
      title: "Replay",
      value: data?.replay ?? 18,
      className: "replay-card",
    },
    {
      title: "Evidence",
      value: data?.evidence ?? 32,
      className: "evidence-card",
    },
  ];

  return (
    <div className="summary-grid">
      {cards.map((card) => (
        <div
          key={card.title}
          className={`summary-card ${card.className}`}
        >
          <h4>{card.title}</h4>
          <h2>{card.value}</h2>
        </div>
      ))}
    </div>
  );
}

export default SummaryCardsTask34;