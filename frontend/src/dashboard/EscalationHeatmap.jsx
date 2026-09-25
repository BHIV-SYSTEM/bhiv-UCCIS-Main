function EscalationHeatmap() {
  return (
    <div className="heatmap">
      <h2>Escalation Heatmap</h2>

      <div className="heat-grid">
        <div className="heat high"></div>
        <div className="heat medium"></div>
        <div className="heat low"></div>
      </div>
    </div>
  );
}

export default EscalationHeatmap;