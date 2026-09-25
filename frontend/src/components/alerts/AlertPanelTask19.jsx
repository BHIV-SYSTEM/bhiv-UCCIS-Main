const alertsTask19 = [
  {
    title: "Mumbai Flood Escalation",
    severity: "Critical"
  },
  {
    title: "Thane Traffic Pressure",
    severity: "Warning"
  },
  {
    title: "MMR Utility Instability",
    severity: "Moderate"
  }
];

const AlertPanelTask19 = () => {
  return (
    <div className="panel-card">

      <h2>LIVE GOVERNANCE STATE</h2>

      {alerts.map((alert, index) => (
        <div className="alert-item" key={index}>

          <div>
            <h3>{alert.title}</h3>
          </div>

          <span>{alert.severity}</span>

        </div>
      ))}

    </div>
  );
};

export default AlertPanelTask19;