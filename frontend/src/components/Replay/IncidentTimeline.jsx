const timeline = [
  {
    time: "08:11",
    event: "Heavy rainfall detected"
  },
  {
    time: "08:32",
    event: "Drainage overload detected"
  },
  {
    time: "09:12",
    event: "Traffic rerouting initiated"
  }
];

const IncidentTimeline = () => {
  return (
    <div className="panel-card">

      <h2>OPERATIONAL TIMELINE</h2>

      {timeline.map((item, index) => (
        <div className="timeline-row" key={index}>

          <span>{item.time}</span>

          <p>{item.event}</p>

        </div>
      ))}

    </div>
  );
};

export default IncidentTimeline;