const AlertCard = ({
  title,
  severity,
  timestamp
}) => {

  return (

    <div className="alert-card">

      <h3>{title}</h3>

      <p>{severity}</p>

      <span>{timestamp}</span>

    </div>

  );

};

export default AlertCard;