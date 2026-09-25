import React, { useEffect, useState } from "react";

export default function TopbarTask24() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="topbar">
      {/* LEFT SECTION */}
      <div className="topbar-left">
        <h1>UCCIS Operational Intelligence Convergence</h1>
        <p>
          Master DB Runtime • Telemetry Engine • Demo Readiness Sprint
        </p>
      </div>

      {/* RIGHT SECTION */}
      <div className="topbar-right">
        <div className="topbar-clock">
          <span className="label">SYSTEM TIME</span>
          <span className="value">
            {time.toLocaleTimeString()}
          </span>
        </div>

        <div className="topbar-status">
          <span className="dot"></span>
          <span>LIVE</span>
        </div>

        <button className="topbar-btn">
          Sync Runtime
        </button>
      </div>
    </div>
  );
}