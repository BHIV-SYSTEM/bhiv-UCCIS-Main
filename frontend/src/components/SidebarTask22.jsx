import React from "react";

import "./Civic.css";

const SidebarTask22 = ({
  phase,
  setPhase,
}) => {
  const phases = [
    "PHASE 1",
    "PHASE 2",
    "PHASE 3",
    "PHASE 4",
  ];

  return (
    <div className="sidebar">
      <h2>UCCIS</h2>

      {phases.map((item) => (
        <button
          key={item}
          className={
            phase === item
              ? "active-phase"
              : ""
          }
          onClick={() =>
            setPhase(item)
          }
        >
          {item}
        </button>
      ))}
    </div>
  );
};

export default SidebarTask22;