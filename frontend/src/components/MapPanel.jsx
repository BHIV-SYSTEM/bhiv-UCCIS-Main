import indiaMap from "../assets/india-map.png";

export default function MapPanel() {

  return (

    <div className="map-panel">

      {/* HEADER */}

      <div className="map-header">

        <h2>State Operational Map</h2>

        <div className="map-status">

          <span className="live-dot"></span>

          LIVE TELEMETRY

        </div>

      </div>

      {/* MAP */}

      <div className="india-map">

        <img
          src={indiaMap}
          alt="India Map"
          className="india-svg"
        />

        {/* MUMBAI */}

        <div className="district mumbai">

          <span className="pulse red"></span>

          <p>Mumbai</p>

        </div>

        {/* NASHIK */}

        <div className="district nashik">

          <span className="pulse green"></span>

          <p>Nashik</p>

        </div>

        {/* PUNE */}

        <div className="district pune">

          <span className="pulse yellow"></span>

          <p>Pune</p>

        </div>

        {/* AURANGABAD */}

        <div className="district aurangabad">

          <span className="pulse yellow"></span>

          <p>Aurangabad</p>

        </div>

        {/* NAGPUR */}

        <div className="district nagpur">

          <span className="pulse green"></span>

          <p>Nagpur</p>

        </div>

      </div>

      {/* LEGEND */}

      <div className="map-footer">

        <div className="legend">

          <span className="legend-green"></span>

          Stable

        </div>

        <div className="legend">

          <span className="legend-yellow"></span>

          Warning

        </div>

        <div className="legend">

          <span className="legend-red"></span>

          Critical

        </div>

      </div>

    </div>

  );
}