import React from "react";

function SidebarTask25({
  activePhase,
  setActivePhase
}) {
  const phases = [
    "Dashboard",
    "Telemetry",
    "Incidents",
    "Escalations",
    "Replay",
    "GIS",
    "Decisions",
    "Operators",
    "Analytics",
    "Logs",
    "System"
  ];

  return (
    <div className="sidebar">
      <div className="logo">
        <h2>UCCIS</h2>
      </div>

      <div className="menu">
        {phases.map((phase) => (
          <button
            key={phase}
            onClick={() => setActivePhase(phase)}
            className={
              activePhase === phase
                ? "active-sidebar"
                : ""
            }
            onClick={() =>
              setActivePhase(phase)
            }
          >
            {phase}
          </button>
        ))}
      </div>
    </div>
  );
}

export default SidebarTask25;