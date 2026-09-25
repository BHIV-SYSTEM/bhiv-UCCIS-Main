import "./KPICard.css";

function KPICardTask38({
  title,
  value,
  subtitle
}) {

  return (
    <div className="kpi-card">

      <div className="kpi-title">
        {title}
      </div>

      <div className="kpi-value">
        {value}
      </div>

      <div className="kpi-subtitle">
        {subtitle}
      </div>

    </div>
  );
}

export default KPICardTask38;