export default function KPIBar({ telemetry }) {
  return (
    <div className="kpi-row">

      <div className="kpi kpi-red">
        <div className="kpi-label">Critical Alerts</div>
        <div className="kpi-value">{telemetry.alerts}</div>
      </div>

      <div className="kpi kpi-green">
        <div className="kpi-label">System Stability</div>
        <div className="kpi-value">{telemetry.stability}%</div>
      </div>

      <div className="kpi kpi-blue">
        <div className="kpi-label">Execution Flow</div>
        <div className="kpi-value">{telemetry.velocity}x</div>
      </div>

      <div className="kpi kpi-yellow">
        <div className="kpi-label">Escalations</div>
        <div className="kpi-value">{telemetry.escalation}</div>
      </div>

      <div className="kpi kpi-purple">
        <div className="kpi-label">Risk Level</div>
        <div className="kpi-value">{telemetry.risk}</div>
      </div>

    </div>
  );
}