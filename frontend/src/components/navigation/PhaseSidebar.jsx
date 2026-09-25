const PhaseSidebar = ({
  activePhase,
  setActivePhase
}) => {

  const phases = [

    "Phase 1",
    "Phase 2",
    "Phase 3",
    "Phase 4",
    "Phase 5",
    "Phase 6",
    "Phase 7",
    "Phase 8",
    "Phase 9"

  ];

  return (

    <div className="sidebar">

      <h2>
        UCCIS
      </h2>

      {phases.map(
        (phase, index) => (

          <button
            key={index}
            className={
              activePhase === index + 1
                ? "phase-btn active"
                : "phase-btn"
            }
            onClick={() =>
              setActivePhase(index + 1)
            }
          >

            {phase}

          </button>

        )
      )}

    </div>

  );

};

export default PhaseSidebar;