export default function HistoricalOperations() {
  return (
    <div className="panel">
      <h2>Historical Operations</h2>

      <div className="history-grid">
        <div className="history-card">
          <h3>Last 24 Hours</h3>
          <h1>24</h1>
        </div>

        <div className="history-card">
          <h3>Last 7 Days</h3>
          <h1>152</h1>
        </div>

        <div className="history-card">
          <h3>Last 30 Days</h3>
          <h1>684</h1>
        </div>
      </div>
    </div>
  );
}