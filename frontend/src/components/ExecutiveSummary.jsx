function ExecutiveSummary({ lineage }) {

  const corrupted =
    lineage.filter(
      item => item.corruptionAttempt
    ).length;

  const disconnected =
    lineage.filter(
      item => item.operatorDisconnected
    ).length;

  return (
    <div className="panel">

      <div className="panel-title">
        EXECUTIVE SUMMARY
      </div>

      <div className="executive-line">
        Replay Corruption Attempts:
        {corrupted}
      </div>

      <div className="executive-line">
        Disconnected Operators:
        {disconnected}
      </div>

      <div className="executive-line">
        Operational Replay Events:
        {lineage.length}
      </div>

    </div>
  );
}

export default ExecutiveSummary;