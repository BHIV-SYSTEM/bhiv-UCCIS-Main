const regions = [
  {
    city: "Mumbai",
    load: "High",
    continuity: "91%"
  },
  {
    city: "Thane",
    load: "Moderate",
    continuity: "88%"
  },
  {
    city: "Navi Mumbai",
    load: "Stable",
    continuity: "94%"
  },
  {
    city: "Kalyan",
    load: "Elevated",
    continuity: "84%"
  }
];

const OperationalMap = () => {
  return (
    <div className="panel-card operational-map">

      <h2>MMR OPERATIONAL GRID</h2>

      <div className="map-grid">

        {regions.map((region, index) => (
          <div className="map-node" key={index}>

            <h3>{region.city}</h3>

            <p>Operational Load: {region.load}</p>

            <span>{region.continuity}</span>

          </div>
        ))}

      </div>

    </div>
  );
};

export default OperationalMap;