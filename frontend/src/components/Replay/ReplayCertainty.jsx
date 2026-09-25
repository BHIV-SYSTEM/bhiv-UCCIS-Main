const certainty = [
  {
    incident: "Flood Escalation",
    certainty: 94
  },
  {
    incident: "Traffic Reconstruction",
    certainty: 88
  },
  {
    incident: "Utility Failure Replay",
    certainty: 91
  }
];

const ReplayCertainty = () => {
  return (
    <div className="panel-card">

      <h2>REPLAY CERTAINTY</h2>

      {certainty.map((item, index) => (
        <div className="certainty-row" key={index}>

          <div>
            <h3>{item.incident}</h3>
          </div>

          <div className="certainty-bar-container">
            <div
              className="certainty-bar"
              style={{
                width: `${item.certainty}%`
              }}
            />
          </div>

          <span>{item.certainty}%</span>

        </div>
      ))}

    </div>
  );
};

export default ReplayCertainty;