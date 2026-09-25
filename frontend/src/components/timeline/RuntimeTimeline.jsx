import React from "react";

const RuntimeTimeline = ({
  timeline = []
}) => {
  return (
    <div className="timeline">
      <h3>Runtime Timeline</h3>

      {timeline.length === 0 ? (
        <p
          style={{
            marginTop: "15px"
          }}
        >
          No Runtime Events
        </p>
      ) : (
        timeline.map((item, index) => (
          <div
            key={index}
            className="timeline-item"
          >
            <div className="timeline-title">
              {item.title}
            </div>

            <div className="timeline-time">
              {item.time}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default RuntimeTimeline;