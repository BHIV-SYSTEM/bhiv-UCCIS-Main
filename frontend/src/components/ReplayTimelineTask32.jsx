import React from "react";

const ReplayTimelineTask32 = ({ timeline = [] }) => {
  if (!Array.isArray(timeline)) {
    return <p>No valid timeline data</p>;
  }

  if (timeline.length === 0) {
    return <p>No replay events available</p>;
  }

  return (
    <div className="timeline">
      <h3>Replay Timeline</h3>

      {timeline.map((item, index) => (
        <div key={index} className="timeline-item">

          <strong>
            Step {item.step ?? item.id ?? index + 1}
          </strong>

          <p>
            {item.event ||
             item.message ||
             item.event_message ||
             JSON.stringify(item)}
          </p>

          {/* optional extra debug info */}
          {item.type && (
            <small style={{ opacity: 0.6 }}>
              Type: {item.type}
            </small>
          )}

        </div>
      ))}
    </div>
  );
};

export default ReplayTimelineTask32;