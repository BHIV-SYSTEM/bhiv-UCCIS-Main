import React from "react";

const hotspots = [
  { id: 1, name: "47.5–48.0°N / 122.5–122.0°W", records: 434, vessels: 340, stationary: 85.94, highSpeed: 2, level: "HIGH" },
  { id: 2, name: "29.5–30.0°N / 90.5–90.0°W", records: 390, vessels: 247, stationary: 57.69, highSpeed: 3, level: "HIGH" },
  { id: 3, name: "29.5–30.0°N / 95.5–95.0°W", records: 335, vessels: 208, stationary: 63.28, highSpeed: 0, level: "HIGH" },
  { id: 4, name: "33.5–34.0°N / 118.5–118.0°W", records: 281, vessels: 212, stationary: 69.40, highSpeed: 0, level: "HIGH" },
  { id: 5, name: "40.5–41.0°N / 74.5–74.0°W", records: 232, vessels: 136, stationary: 61.21, highSpeed: 7, level: "HIGH" },
  { id: 6, name: "29.0–29.5°N / 95.0–94.5°W", records: 229, vessels: 149, stationary: 41.92, highSpeed: 1, level: "MODERATE" },
  { id: 7, name: "37.5–38.0°N / 122.5–122.0°W", records: 226, vessels: 150, stationary: 58.85, highSpeed: 19, level: "HIGH" },
  { id: 8, name: "49.0–49.5°N / 123.5–123.0°W", records: 210, vessels: 133, stationary: 71.43, highSpeed: 8, level: "HIGH" },
  { id: 9, name: "32.5–33.0°N / 117.5–117.0°W", records: 192, vessels: 160, stationary: 85.42, highSpeed: 0, level: "HIGH" },
  { id: 10, name: "25.5–26.0°N / 80.5–80.0°W", records: 173, vessels: 134, stationary: 61.27, highSpeed: 6, level: "MODERATE" },
];

const colors = {
  HIGH: { bg: "#7f1d1d", border: "#ef4444" },
  MODERATE: { bg: "#78350f", border: "#f59e0b" },
  LOW: { bg: "#14532d", border: "#22c55e" },
};

function Metric({ label, value }) {
  return (
    <div style={{
      background: "rgba(0,0,0,0.18)",
      borderRadius: "7px",
      padding: "8px"
    }}>
      <div style={{ fontSize: "10px", color: "#c7d7eb", marginBottom: "3px" }}>
        {label}
      </div>
      <div style={{ fontSize: "15px", fontWeight: 800, color: "#ffffff" }}>
        {value}
      </div>
    </div>
  );
}

function ZoneHeatmap() {
  return (
    <div
      className="zone-heatmap"
      style={{
        width: "100%",
        background: "#081b33",
        border: "1px solid #1b3f70",
        borderRadius: "14px",
        padding: "20px",
        boxSizing: "border-box",
        color: "#ffffff"
      }}
    >
      <div style={{ marginBottom: "18px" }}>
        <h2 style={{ margin: 0, fontSize: "22px", color: "#ffffff" }}>
          AIS Spatial Heatmap
        </h2>
        <p style={{
          margin: "7px 0 0",
          color: "#b7c8df",
          fontSize: "13px",
          lineHeight: 1.5
        }}>
          Top 10 AIS spatial hotspots using 0.5° × 0.5° latitude/longitude
          grid cells.
        </p>
      </div>

      <div style={{
        display: "flex",
        gap: "16px",
        flexWrap: "wrap",
        marginBottom: "18px",
        fontSize: "12px",
        color: "#b7c8df"
      }}>
        {Object.entries(colors).map(([level, style]) => (
          <div key={level} style={{ display: "flex", alignItems: "center", gap: "7px" }}>
            <span style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              background: style.border,
              display: "inline-block"
            }} />
            {level}
          </div>
        ))}
      </div>

      <div
        className="heatmap-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "14px"
        }}
      >
        {hotspots.map((zone) => {
          const style = colors[zone.level];

          return (
            <div
              key={zone.id}
              className={`zone-card ${zone.level.toLowerCase()}`}
              style={{
                background: style.bg,
                border: `1px solid ${style.border}`,
                borderRadius: "12px",
                padding: "16px",
                minHeight: "190px",
                boxSizing: "border-box"
              }}
            >
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "12px"
              }}>
                <span style={{
                  fontSize: "11px",
                  color: "#dbeafe",
                  fontWeight: 700
                }}>
                  HOTSPOT #{zone.id}
                </span>

                <span style={{
                  fontSize: "10px",
                  fontWeight: 800,
                  color: "#ffffff",
                  border: `1px solid ${style.border}`,
                  borderRadius: "20px",
                  padding: "4px 8px"
                }}>
                  {zone.level}
                </span>
              </div>

              <h3 style={{
                margin: "0 0 10px",
                fontSize: "15px",
                lineHeight: 1.35,
                color: "#ffffff"
              }}>
                {zone.name}
              </h3>

              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "8px"
              }}>
                <Metric label="AIS Records" value={zone.records} />
                <Metric label="Unique Vessels" value={zone.vessels} />
                <Metric label="Stationary" value={`${zone.stationary.toFixed(2)}%`} />
                <Metric label="High-Speed" value={zone.highSpeed} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ZoneHeatmap;
