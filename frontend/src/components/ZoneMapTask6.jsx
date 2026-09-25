import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";

export default function ZoneMapTask6({ zones, activeZone }) {
  const center = [18.5204, 73.8567]; // Pune

  return (
    <div className="card map">
      <h2>City Risk Map</h2>

      <MapContainer center={center} zoom={12} style={{ height: "350px" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {zones.map((z, i) => {
          const lat = 18.52 + i * 0.01;
          const lng = 73.85 + i * 0.01;

          const isActive = activeZone?.zone_id === z.zone_id;

          return (
            <CircleMarker
              key={i}
              center={[lat, lng]}
              radius={10 + z.risk_score / 10}
              pathOptions={{
                color: isActive ? "yellow" : z.risk_score > 70 ? "red" : "green",
                fillOpacity: 0.6
              }}
            >
              <Tooltip>
                {z.zone_id} <br />
                Risk: {z.risk_score}
              </Tooltip>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}