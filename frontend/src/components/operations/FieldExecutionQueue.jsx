const operations = [
  {
    team: "Drainage Response Unit",
    district: "Mumbai",
    status: "Deploying"
  },
  {
    team: "Traffic Coordination Cell",
    district: "Thane",
    status: "Active"
  },
  {
    team: "Utility Recovery Team",
    district: "MMR",
    status: "Escalated"
  }
];

const FieldExecutionQueue = () => {
  return (
    <div className="panel-card">

      <h2>FIELD EXECUTION QUEUE</h2>

      {operations.map((item, index) => (
        <div className="execution-row" key={index}>

          <div>
            <h3>{item.team}</h3>
            <p>{item.district}</p>
          </div>

          <span className="execution-status">
            {item.status}
          </span>

        </div>
      ))}

    </div>
  );
};

export default FieldExecutionQueue;