import React from "react";

const KPICards = () => {
  const cards = [
    {
      title: "Signals",
      value: 124
    },
    {
      title: "Incidents",
      value: 17
    },
    {
      title: "Escalations",
      value: 6
    },
    {
      title: "Replay",
      value: 83
    }
  ];

  return (
    <div className="card-grid">

      {cards.map((card, index) => (
        <div
          key={index}
          className="card"
        >
          <h3>{card.title}</h3>
          <h2>{card.value}</h2>
        </div>
      ))}

    </div>
  );
};

export default KPICards;