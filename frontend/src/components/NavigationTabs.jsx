function NavigationTabs({
  active,
  setActive
}) {

  const tabs = [
    "Signals",
    "Telemetry",
    "Incidents",
    "Escalations",
    "Replay",
    "Evidence",
    "Health"
  ];

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "10px"
      }}
    >
      {tabs.map((tab) => (

        <button
          key={tab}
          onClick={() =>
            setActive(tab)
          }
          style={{
            padding:
              "10px 20px",
            border: "none",
            borderRadius:
              "8px",
            cursor: "pointer",
            fontWeight: "bold",
            background:
              active === tab
                ? "#2563eb"
                : "#e5e7eb",
            color:
              active === tab
                ? "#fff"
                : "#111"
          }}
        >
          {tab}
        </button>

      ))}
    </div>
  );
}

export default NavigationTabs;