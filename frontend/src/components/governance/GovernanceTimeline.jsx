const governanceEvents = [
  {
    time: "08:12",
    action: "Rainfall escalation review initiated"
  },
  {
    time: "08:44",
    action: "Field coordination activated"
  },
  {
    time: "09:10",
    action: "Emergency routing approved"
  },
  {
    time: "09:42",
    action: "Utility restoration escalation"
  }
];

const GovernanceTimeline = () => {
  return (
    <div className="panel-card">

      <h2>GOVERNANCE ACTIVITY</h2>

      {governanceEvents.map((event, index) => (
        <div className="governance-row" key={index}>

          <span>{event.time}</span>

          <p>{event.action}</p>

        </div>
      ))}

    </div>
  );
};

export default GovernanceTimeline;