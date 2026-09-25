import React from "react";

export default function StatusCards({ phase }) {

  const data = {

    replay: {
      card1: "124",
      card2: "98%",
      card3: "42",
      card4: "ACTIVE"
    },

    concurrency: {
      card1: "18",
      card2: "12",
      card3: "99%",
      card4: "STABLE"
    },

    corruption: {
      card1: "7",
      card2: "7",
      card3: "100%",
      card4: "RESTORED"
    },

    lineage: {
      card1: "999",
      card2: "0",
      card3: "100%",
      card4: "IMMUTABLE"
    },

    enforcement: {
      card1: "45",
      card2: "39",
      card3: "91%",
      card4: "VISIBLE"
    },

    field: {
      card1: "66",
      card2: "61",
      card3: "5",
      card4: "TRACKED"
    },

    stability: {
      card1: "98%",
      card2: "12",
      card3: "99%",
      card4: "CONSISTENT"
    },

    governance: {
      card1: "100%",
      card2: "18",
      card3: "92%",
      card4: "SAFE"
    },

    failure: {
      card1: "11",
      card2: "4",
      card3: "3",
      card4: "RECOVERED"
    },

    final: {
      card1: "100%",
      card2: "ACTIVE",
      card3: "99.9%",
      card4: "VALIDATED"
    }

  };

  const current = data[phase] || data.final;

  const cards = [

    {
      title: "Replay Stable",
      value: current.card1
    },

    {
      title: "Recovery Active",
      value: current.card2
    },

    {
      title: "Observability Enabled",
      value: current.card3
    },

    {
      title: "Governance Safe",
      value: current.card4
    }

  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4,1fr)",
        gap: "20px",
        marginTop: "20px"
      }}
    >

      {cards.map((card, index) => (

        <div
          key={index}
          style={{
            background: "#111827",
            padding: "25px",
            borderRadius: "14px",
            border: "1px solid #1e293b",
            boxShadow:
              "0 0 10px rgba(0,0,0,0.3)"
          }}
        >

          <h2
            style={{
              fontSize: "30px",
              marginBottom: "10px",
              color: "#3b82f6"
            }}
          >
            {card.value}
          </h2>

          <p
            style={{
              color: "#cbd5e1",
              fontSize: "15px"
            }}
          >
            {card.title}
          </p>

        </div>

      ))}

    </div>
  );
}