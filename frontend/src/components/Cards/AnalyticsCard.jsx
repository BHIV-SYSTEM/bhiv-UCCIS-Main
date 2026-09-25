export default function AnalyticsCard({

  title,
  metric,
  change,
  description,
  type

}) {

  return (

    <div className={`analytics-card ${type}`}>

      {/* HEADER */}

      <div className="analytics-header">

        {title}

      </div>

      {/* METRIC */}

      <div className="analytics-metric">

        {metric}

      </div>

      {/* CHANGE */}

      <div className="analytics-change">

        {change}

      </div>

      {/* DESCRIPTION */}

      <div className="analytics-description">

        {description}

      </div>

    </div>

  );
}