const ReplayCard = ({
  incident,
  confidence,
  entropy
}) => {

  return (

    <div className="replay-card">

      <h3>{incident}</h3>

      <p>
        Confidence: {confidence}%
      </p>

      <p>
        Entropy: {entropy}%
      </p>

      <div className="progress">

        <div
          className="fill"
          style={{
            width: `${confidence}%`
          }}
        />

      </div>

    </div>

  );

};

export default ReplayCard;