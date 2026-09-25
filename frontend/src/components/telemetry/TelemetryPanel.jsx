const telemetry = [
  {
    service: "Traffic Grid",
    latency: "42ms",
    health: "Operational"
  },
  {
    service: "Police Mesh",
    latency: "64ms",
    health: "Stable"
  },
  {
    service: "Health Grid",
    latency: "38ms",
    health: "Operational"
  }
];

const TelemetryPanel = () => {
  return (
    <div className="panel-card">

      <h2>STATE TELEMETRY</h2>

      {telemetry.map((item, index) => (
        <div className="telemetry-row" key={index}>

          <div>
            <h3>{item.service}</h3>
            <p>{item.health}</p>
          </div>

          <span>{item.latency}</span>

        </div>
      ))}

    </div>
  );
};

export default TelemetryPanel;