import React from "react";

import "./Runtime.css";

const TrafficRuntime = () => {
  return (
    <div className="runtime-page">
      <h1>
        Traffic Congestion Runtime
      </h1>

      <p>
        Traffic telemetry
        overload and runtime
        congestion monitoring.
      </p>

      <div className="info-card">
        <h2>
          Runtime Information
        </h2>

        <ul>
          <li>
            Signal congestion
            detected
          </li>

          <li>
            Escalation chain
            triggered
          </li>

          <li>
            Traffic rerouting
            activated
          </li>

          <li>
            Replay reconstruction
            enabled
          </li>
        </ul>
      </div>
    </div>
  );
};

export default TrafficRuntime;