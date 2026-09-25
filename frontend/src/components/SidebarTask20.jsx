function SidebarTask20({
  activePhase,
  setActivePhase
}) {
  const phases = [
    {
      id: "overview",
      label: "Overview"
    },

    {
      id: "phase1",
      label: "Phase 1"
    },

    {
      id: "phase2",
      label: "Phase 2"
    },

    {
      id: "phase3",
      label: "Phase 3"
    },

    {
      id: "phase4",
      label: "Phase 4"
    },

    {
      id: "phase5",
      label: "Phase 5"
    },

    {
      id: "phase6",
      label: "Phase 6"
    },

    {
      id: "phase7",
      label: "Phase 7"
    }
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        UCCIS
      </div>

      <div className="sidebar-menu">
        {phases.map((phase) => (
          <button
            key={phase.id}
            className={
              activePhase ===
              phase.id
                ? "sidebar-btn active"
                : "sidebar-btn"
            }
            onClick={() =>
              setActivePhase(
                phase.id
              )
            }
          >
            {phase.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default SidebarTask20;