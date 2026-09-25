export default function ReplayTimeline() {

  const timeline = [

    {
      time: "10:04 AM",
      title: "Incident Triggered",
      status: "critical"
    },

    {
      time: "10:12 AM",
      title: "District Acknowledged",
      status: "warning"
    },

    {
      time: "10:28 AM",
      title: "Recovery Workflow Started",
      status: "stable"
    },

    {
      time: "10:51 AM",
      title: "Replay Reconstruction Completed",
      status: "stable"
    }

  ];

  return (

    <div className="timelineCard">

      <div className="timelineHeader">
        Replay Timeline Playback
      </div>

      <div className="timelineBody">

        {timeline.map((item, index) => (

          <div
            className="timelineItem"
            key={index}
          >

            <div className={`timelineDot ${item.status}`} />

            <div>

              <h4>{item.title}</h4>

              <span>{item.time}</span>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}