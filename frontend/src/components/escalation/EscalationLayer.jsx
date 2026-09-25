const escalationData = [
  {
    district: "Mumbai",
    risk: 82,
    entropy: 12
  },
  {
    district: "Thane",
    risk: 68,
    entropy: 18
  },
  {
    district: "MMR",
    risk: 74,
    entropy: 14
  }
];

const EscalationLayer = () => {
  return (
    <div className="panel-card">

      <h2>ESCALATION INTELLIGENCE</h2>

      {escalationData.map((item, index) => (
        <div className="escalation-row" key={index}>

          <div>
            <h3>{item.district}</h3>
            <p>Entropy: {item.entropy}%</p>
          </div>

          <div className="risk-bar-container">
            <div
              className="risk-bar"
              style={{ width: `${item.risk}%` }}
            />
          </div>

          <span>{item.risk}%</span>

        </div>
      ))}

    </div>
  );
};

export default EscalationLayer;