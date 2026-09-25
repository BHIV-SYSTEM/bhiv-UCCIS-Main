function SystemHealth() {

  const systems = [
    {
      name: "Backend Services",
      status: "Operational"
    },
    {
      name: "Database",
      status: "Operational"
    },
    {
      name: "APIs",
      status: "Operational"
    },
    {
      name: "WebSocket",
      status: "Operational"
    },
    {
      name: "Polling Engine",
      status: "Operational"
    }
  ];

  return (
    <div className="panel system-health-panel">

      <div className="panel-header">

        <h2>System Health Overview</h2>

        <span className="health-live">
          ● Healthy
        </span>

      </div>

      <div className="health-content">

        {/* LEFT SIDE */}

        <div className="health-services">

          {systems.map((system, index) => (

            <div className="health-row" key={index}>

              <span className="service-name">
                {system.name}
              </span>

              <span className="service-status">
                {system.status}
              </span>

            </div>

          ))}

        </div>

        {/* RIGHT SIDE */}

        <div className="health-score-wrapper">

          <div className="health-ring">

            <div className="health-inner">

              <h1>98%</h1>

              <p>Healthy</p>

            </div>

          </div>

          <span className="health-message">
            All systems normal
          </span>

        </div>

      </div>

    </div>
  );
}

export default SystemHealth;