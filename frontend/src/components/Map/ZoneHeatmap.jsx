const zones = [
  {
    zone: "South Mumbai",
    load: 92
  },
  {
    zone: "Thane West",
    load: 74
  },
  {
    zone: "Navi Mumbai",
    load: 61
  },
  {
    zone: "Kalyan",
    load: 85
  }
];

const ZoneHeatmap = () => {
  return (
    <div className="panel-card">

      <h2>ZONE INTELLIGENCE HEATMAP</h2>

      <div className="heatmap-grid">

        {zones.map((zone, index) => (
          <div
            key={index}
            className="heatmap-cell"
            style={{
              opacity: zone.load / 100
            }}
          >

            <h3>{zone.zone}</h3>

            <span>{zone.load}%</span>

          </div>
        ))}

      </div>

    </div>
  );
};

export default ZoneHeatmap;