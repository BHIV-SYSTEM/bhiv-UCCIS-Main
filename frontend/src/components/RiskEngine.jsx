export default function RiskEngine({ risk }) {
  return (
    <div className="panel small">

      <div className="panel-title">
        AI Governance Risk Engine
      </div>

      <div className="risk-box">
        Current Governance Risk:
        <span className={`risk-${risk.toLowerCase()}`}>
          {" "}{risk}
        </span>
      </div>

    </div>
  );
}