import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const getIcon = (status) => {
  let color = "#52c41a";

  if (status === "RED") {
    color = "#ff4d4f";
  } else if (status === "YELLOW") {
    color = "#faad14";
  }

  return L.divIcon({
    className: "custom-marker",
    html: `
      <div style="
        width:16px;
        height:16px;
        border-radius:50%;
        background:${color};
        border:2px solid #ffffff;
        box-shadow:0 0 8px ${color};
      "></div>
    `,
    iconSize: [16, 16],
    iconAnchor: [8, 8]
  });
};

const ZoneMap = ({ zones = [] }) => {
  return (
    <MapContainer
      center={[21.1458, 79.0882]}
      zoom={12}
      style={{
        height: "350px",
        width: "100%",
        borderRadius: "10px"
      }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {zones.map((zone, index) => (
        <Marker
          key={zone.id || index}
          position={[
            21.1458 + index * 0.01,
            79.0882 + index * 0.01
          ]}
          icon={getIcon(zone.status)}
          eventHandlers={{
            mouseover: (e) => e.target.openPopup(),
            mouseout: (e) => e.target.closePopup()
          }}
        >
          <Popup closeButton={false} autoClose={false}>
            <div>
              <strong>{zone.name}</strong>

              <br />

              Status: {zone.status}

              <br />

              {zone.requestStatus === "❌ Rejected" && (
                <div
                  style={{
                    color: "red",
                    fontWeight: "bold",
                    marginTop: "8px"
                  }}
                >
                  ⚠️ Action Rejected
                </div>
              )}

              {zone.requestStatus === "✅ Approved" && (
                <div
                  style={{
                    color: "green",
                    fontWeight: "bold",
                    marginTop: "8px"
                  }}
                >
                  ✅ Action Approved
                </div>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default ZoneMap;