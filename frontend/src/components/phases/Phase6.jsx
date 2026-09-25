import { useEffect, useState } from "react";

const Phase6 = () => {

  const [time, setTime] =
    useState("");

  const [heartbeat, setHeartbeat] =
    useState(false);

  useEffect(() => {

    const runtime =
      setInterval(() => {

        setTime(
          new Date()
            .toLocaleTimeString()
        );

        setHeartbeat(prev => !prev);

      }, 1000);

    return () =>
      clearInterval(runtime);

  }, []);

  return (

    <div>

      <h1 className="phase-title">

        PHASE 6 — REAL OPERATIONAL FEEL

      </h1>

      <div className="triple-grid">

        <div className="panel-card">

          <h2>
            Operational Heartbeat
          </h2>

          <div className="heartbeat-wrapper">

            <div
              className={
                heartbeat
                  ? "heartbeat active"
                  : "heartbeat"
              }
            />

            <span>
              Runtime Active
            </span>

          </div>

        </div>

        <div className="panel-card">

          <h2>
            Active Operators
          </h2>

          <div className="health-score">

            247

          </div>

        </div>

        <div className="panel-card">

          <h2>
            System Timestamp
          </h2>

          <p className="runtime-time">

            {time}

          </p>

        </div>

      </div>

      <div className="panel-card">

        <h2>
          Mock Streaming Layer
        </h2>

        <div className="ticker-wrapper">

          <div className="ticker-track">

            <div className="ticker-item">
              Mumbai telemetry updated
            </div>

            <div className="ticker-item">
              Replay continuity verified
            </div>

            <div className="ticker-item">
              Escalation aging counter active
            </div>

            <div className="ticker-item">
              Runtime polling successful
            </div>

          </div>

        </div>

      </div>

    </div>

  );

};

export default Phase6;