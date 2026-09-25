import React from "react";

const TimelinePanel = () => {
  const timeline = [
    "Signal Received",
    "Telemetry Processed",
    "Incident Created",
    "Escalated"
  ];

  return (
    <div className="panel">

      <h2>Runtime Timeline</h2>

      <ul>
        {timeline.map((item, index) => (
          <li key={index}>
            {item}
          </li>
        ))}
      </ul>

    </div>
  );
};

export default TimelinePanel;