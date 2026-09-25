import React from "react";

function ReplayTimelineTask25({ replay }) {
  return (
    <div className="uccis-card">
      <h3>⏪ Replay Timeline</h3>

      <div className="timeline">
        {replay.map((item) => (
          <div key={item.id} className="timeline-item">
            <div className="timeline-dot"></div>

            <div className="timeline-content">
              <h4>{item.session_name}</h4>
              <small>{item.start_time}</small>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ReplayTimelineTask25;