const CommandHeader = () => {

  return (

    <div className="command-header">

      <div>

        <h1>
          UCCIS GOVERNANCE COMMAND CENTER
        </h1>

        <p>
          Principal Secretary Operational Layer
        </p>

      </div>

      <div className="header-metrics">

        <div className="metric-card critical">

          <h2>
            12
          </h2>

          <span>
            Active Critical Alerts
          </span>

        </div>

        <div className="metric-card stable">

          <h2>
            91%
          </h2>

          <span>
            Operational Health
          </span>

        </div>

      </div>

    </div>

  );

};

export default CommandHeader;