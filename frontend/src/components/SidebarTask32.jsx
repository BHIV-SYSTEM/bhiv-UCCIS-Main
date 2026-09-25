export default function SidebarTask32({
  activePanel,
  setActivePanel,
}) {
  return (
    <div className="sidebar">

      <h2>UCCIS</h2>

      <button
        className={activePanel === "dashboard" ? "active" : ""}
        onClick={() => setActivePanel("dashboard")}
      >
        Dashboard
      </button>

      <button
        className={activePanel === "signals" ? "active" : ""}
        onClick={() => setActivePanel("signals")}
      >
        Signal Layer
      </button>

      <button
        className={activePanel === "runtime" ? "active" : ""}
        onClick={() => setActivePanel("runtime")}
      >
        System Runtime Health
      </button>

      {/* <button
        className={activePanel === "replay" ? "active" : ""}
        onClick={() => setActivePanel("replay")}
      >
        Replay
      </button>

      <button
        className={activePanel === "logs" ? "active" : ""}
        onClick={() => setActivePanel("logs")}
      >
        Runtime Logs
      </button> */}

    </div>
  );
}