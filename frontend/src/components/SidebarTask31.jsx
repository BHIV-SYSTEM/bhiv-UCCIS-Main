import "../index.css";

const SidebarTask31 = ({ setPhase }) => {
  return (
    <div className="sidebar">
      <h2>UCCIS</h2>

      <button onClick={() => setPhase("dashboard")}>
        Dashboard
      </button>

      {/* <button onClick={() => setPhase("signals")}>
        Signal Layer
      </button> */}

      <button onClick={() => setPhase("telemetry")}>
        Telemetry Events
      </button>

      {/* <button onClick={() => setPhase("incidents")}>
        Incidents
      </button> */}

      <button onClick={() => setPhase("escalations")}>
        Escalations
      </button>

      <button onClick={() => setPhase("replay")}>
        Replay Sessions
      </button>

      <button onClick={() => setPhase("runtime")}>
        Runtime Logs
      </button>
    </div>
  );
};

export default SidebarTask31;