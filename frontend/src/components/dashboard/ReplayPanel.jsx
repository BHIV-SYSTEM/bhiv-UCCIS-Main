import React, { useState } from "react";

function ReplayPanel() {
  const [showReplay, setShowReplay] =
    useState(false);

  const replayData = [
    {
      time: "09:01:12",
      event: "Signal Received"
    },
    {
      time: "09:01:30",
      event: "Telemetry Processed"
    },
    {
      time: "09:02:10",
      event: "Incident Created"
    },
    {
      time: "09:03:45",
      event: "Escalation Triggered"
    },
    {
      time: "09:05:20",
      event: "Evidence Attached"
    },
    {
      time: "09:06:40",
      event: "Incident Resolved"
    }
  ];

  return (
    <div className="panel">
      <h2>Replay Engine</h2>

      <button
        className="replay-button"
        onClick={() =>
          setShowReplay(!showReplay)
        }
      >
        {showReplay
          ? "Hide Replay"
          : "Replay Trace"}
      </button>

      {showReplay && (
        <div
          style={{
            marginTop: "20px"
          }}
        >
          <h3>
            TRACE-1001 Timeline
          </h3>

          <ul className="timeline">
            {replayData.map(
              (item, index) => (
                <li key={index}>
                  <strong>
                    {item.time}
                  </strong>
                  {" - "}
                  {item.event}
                </li>
              )
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ReplayPanel;