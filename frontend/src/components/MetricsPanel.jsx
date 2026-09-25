export default function MetricsPanel({ data }) {
  return (
    <div className="metrics">
      <div>Zone: {data.zone_id}</div>
      <div>Risk: {data.risk_score}</div>
      <div>State: {data.current_state}</div>
    </div>
  );
}