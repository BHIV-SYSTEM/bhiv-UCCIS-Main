function AlertPanelTask16() {

  const alerts = [

    "Replay Divergence Detected",

    "Telemetry Delay Active",

    "Corruption Attempt Isolated",

    "Operator Disconnect Detected"

  ];

  return (

    <div style={panel}>

      <h2>
        Alerts & Escalations
      </h2>

      {alerts.map((item, index) => (

        <div
          key={index}
          style={alertBox}
        >
          {item}
        </div>

      ))}

    </div>

  );

}

const panel = {

  background: "#102030",

  padding: "20px",

  borderRadius: "12px",

  border: "1px solid #1f3b57"
};

const alertBox = {

  padding: "12px",

  background: "#1e293b",

  marginTop: "10px",

  borderRadius: "8px",

  color: "#ef4444"
};

export default AlertPanelTask16;