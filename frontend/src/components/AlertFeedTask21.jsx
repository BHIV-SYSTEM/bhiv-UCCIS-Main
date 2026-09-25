function AlertFeedTask21() {

  const alerts = [
    {
      title: "Flood Risk Detected",
      district: "Pune District, Maharashtra",
      level: "HIGH"
    },
    {
      title: "Fire Incident Reported",
      district: "Nagpur District, Maharashtra",
      level: "HIGH"
    },
    {
      title: "Medical Emergency",
      district: "Mumbai District, Maharashtra",
      level: "MEDIUM"
    },
    {
      title: "Traffic Jam Alert",
      district: "Thane District, Maharashtra",
      level: "LOW"
    },
    {
      title: "Power Outage",
      district: "Nashik District, Maharashtra",
      level: "INFO"
    }
  ];

  return (
    <div className="panel alert-feed-panel">

      <div className="panel-header">
        <h2>Live Alert Feed</h2>

        <span className="live-badge">
          ● LIVE
        </span>
      </div>

      <div className="alert-feed">

        {alerts.map((alert, index) => (

          <div className="alert-card" key={index}>

            <div className="alert-left">

              <div className={`alert-icon ${alert.level.toLowerCase()}`}>
                !
              </div>

              <div>

                <h4>{alert.title}</h4>

                <p>{alert.district}</p>

              </div>

            </div>

            <div
              className={`alert-level ${alert.level.toLowerCase()}`}
            >
              {alert.level}
            </div>

          </div>

        ))}

      </div>

    </div>
  );
}

export default AlertFeedTask21;