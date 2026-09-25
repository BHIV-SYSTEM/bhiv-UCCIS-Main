const ExecutiveCard = ({
  title,
  value,
  status
}) => {

  return (

    <div className="executive-card">

      <h3>
        {title}
      </h3>

      <h1>
        {value}
      </h1>

      <span>
        {status}
      </span>

    </div>

  );

};

export default ExecutiveCard;