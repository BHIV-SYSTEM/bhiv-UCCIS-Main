const TimelineCard = ({
  time,
  action
}) => {

  return (

    <div className="timeline-card">

      <span>{time}</span>

      <p>{action}</p>

    </div>

  );

};

export default TimelineCard;