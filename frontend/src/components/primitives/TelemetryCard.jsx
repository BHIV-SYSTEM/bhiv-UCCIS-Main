const TelemetryCard = ({
  service,
  district,
  health
}) => {

  return (

    <div className="telemetry-card">

      <h3>{service}</h3>

      <p>{district}</p>

      <span>{health}</span>

    </div>

  );

};

export default TelemetryCard;