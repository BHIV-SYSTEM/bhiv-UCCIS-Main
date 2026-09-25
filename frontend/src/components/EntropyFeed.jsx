function EntropyFeed({ lineage }) {

  return (
    <div className="panel">

      <div className="panel-title">
        LIVE ENTROPY FEED
      </div>

      {lineage.slice(-5).map((item) => (

        <div
          key={item.id}
          className="feed-item"
        >

          Replay Confidence:
          {item.confidence}% |

          {item.corruptionAttempt
            ? " Corruption"
            : " Stable"}

        </div>

      ))}

    </div>
  );
}

export default EntropyFeed;