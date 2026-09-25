export default function StatusCard({

  title,
  value,
  status,
  type

}) {

  return (

    <div className={`status-card ${type}`}>

      {/* HEADER */}

      <div className="status-card-header">

        {title}

      </div>

      {/* VALUE */}

      <div className="status-card-value">

        {value}

      </div>

      {/* STATUS */}

      <div className="status-card-status">

        {status}

      </div>

    </div>

  );
}