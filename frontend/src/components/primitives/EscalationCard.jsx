const EscalationCard = ({
  district,
  risk
}) => {

  return (

    <div className="escalation-card">

      <h3>{district}</h3>

      <div className="risk-wrapper">

        <div
          className="risk-fill"
          style={{
            width: `${risk}%`
          }}
        />

      </div>

      <span>{risk}%</span>

    </div>

  );

};

export default EscalationCard;