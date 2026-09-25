function ReplayTimelineTask21() {

  const timelineData = [
    {
      time: "11:40 AM",
      title: "Flood Risk Detected",
      description: "Pune District",
      type: "critical"
    },
    {
      time: "11:35 AM",
      title: "Alert Sent To Departments",
      description: "Multiple Departments",
      type: "warning"
    },
    {
      time: "11:32 AM",
      title: "Teams Dispatched",
      description: "Police, NDRF, Local Admin",
      type: "info"
    },
    {
      time: "11:28 AM",
      title: "Situation Under Control",
      description: "Monitoring Continued",
      type: "success"
    }
  ];

  return (
    <div className="panel replay-panel">

      <div className="panel-header">

        <h2>Replay Timeline</h2>

        <span className="live-indicator">
          ● Live
        </span>

      </div>

      <div className="replay-timeline">

        {timelineData.map((item, index) => (

          <div className="replay-item" key={index}>

            <div className="timeline-left">

              <span className="timeline-time">
                {item.time}
              </span>

            </div>

            <div className="timeline-center">

              <div className={`timeline-dot ${item.type}`}></div>

              {index !== timelineData.length - 1 && (
                <div className="timeline-line"></div>
              )}

            </div>

            <div className="timeline-right">

              <h4>{item.title}</h4>

              <p>{item.description}</p>

            </div>

          </div>

        ))}

      </div>

      <div className="timeline-footer">

        <button className="timeline-button">
          View Full Replay →
        </button>

      </div>

    </div>
  );
}

export default ReplayTimelineTask21;