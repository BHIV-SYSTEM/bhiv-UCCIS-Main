import React from "react";
import ZoneChart from "./ZoneChart";

const ZoneCard = ({ zone, onAction }) => {
  const zoneName =
    zone.name ||
    zone.zone_name ||
    zone.zone ||
    `Zone ${String(zone.zone_id || zone.id).replace(/[^\d]/g, "")}`;

  const traffic =
    zone.traffic_density !== undefined
    ? zone.traffic_density
    : zone.traffic;

  const violations =
    zone.violation_count !== undefined
    ? zone.violation_count
    : zone.violations;

  const congestion =
    zone.congestion_level !== undefined
    ? zone.congestion_level
    : zone.congestion_score;

  const status = zone.status || "GREEN";

  const getColor = () => {
    switch (status) {
      case "RED":
        return "#ff4d4f";
      case "YELLOW":
        return "#faad14";
      default:
        return "#52c41a";
    }
  };

  const getTrafficReason = () => {
    if (traffic > 70) return "Traffic High";
    if (traffic > 50) return "Traffic Moderate";
    return "Traffic Low";
  };

  const getViolationReason = () => {
    if (violations > 10) return "Violations High";
    if (violations > 5) return "Violations Moderate";
    return "Violations Low";
  };

  const getAlert = () => {
    if (traffic > 70) return `HIGH_TRAFFIC — ${zoneName}`;
    if (traffic > 50) return `MEDIUM_TRAFFIC — ${zoneName}`;
    return `LOW_TRAFFIC — ${zoneName}`;
  };

  return (
    <div
      style={{
        width: 320,
        background: "#1e2438",
        borderRadius: 14,
        border: `2px solid ${getColor()}`,
        padding: 18,
        color: "white",
        boxShadow: "0 8px 20px rgba(0,0,0,.35)",
      }}
    >
      <h2>{zoneName}</h2>

      <h3
        style={{
          color: getColor(),
          marginBottom: 18,
        }}
      >
        {status}
      </h3>

      <p>
        🚓 <strong>Traffic:</strong> {traffic}
      </p>

      <p>
        ⚠️ <strong>Violations:</strong> {violations}
      </p>

      <p>
        📈 <strong>Congestion:</strong> {congestion}
      </p>

      <div
        style={{
          height: 80,
          marginTop: 15,
          marginBottom: 15,
          pointerEvents: "none",
        }}
      >
        <ZoneChart />
      </div>

      <button
        onClick={() => onAction(zone.id || zone.zone_id)}
        disabled={zone.isLoading}
        style={{
          width: "100%",
          padding: 12,
          border: "none",
          borderRadius: 8,
          cursor: "pointer",
          fontWeight: "bold",
          color: "white",
          background: zone.isLoading ? "#555" : "#1677ff",
        }}
      >
        {zone.isLoading ? "Processing..." : "Deploy Traffic"}
      </button>

      {zone.requestStatus && (
        <div
          style={{
            marginTop: 18,
            fontWeight: "bold",
            fontSize: 20,
            color: zone.requestStatus.includes("Approved")
              ? "#52c41a"
              : zone.requestStatus.includes("Rejected")
              ? "#ff4d4f"
              : "#fff",
          }}
        >
          {zone.requestStatus}
        </div>
      )}

      {zone.showDetails && (
  <div
    style={{
      marginTop: 20,
      background: "#111522",
      borderRadius: 10,
      padding: 15,
    }}
  >
    <h3>Metrics:</h3>

    <div>
      Traffic: {zone.traffic_density ?? zone.traffic}
    </div>

    <div>
      Violations: {zone.violation_count ?? zone.violations}
    </div>

    <div>
      Congestion: {zone.congestion_level ?? zone.congestion}
    </div>

    <br />

    <h3>Reason:</h3>

    <ul>
      <li>{getTrafficReason()}</li>

      <li>{getViolationReason()}</li>

      {(zone.trend === "increasing" ||
        (zone.traffic_density ?? zone.traffic) > 60) && (
        <li>trend increasing</li>
      )}

      {zone.trend === "stable" && (
        <li>trend stable</li>
      )}
    </ul>

    <br />

    <h3 style={{ color: "#ff6b6b" }}>
      Alert:
    </h3>

    <div>{getAlert()}</div>

    <br />

    <h3 style={{ color: "#69c0ff" }}>
      Recommendation:
    </h3>

    <div>
      Increase signal timing / deploy traffic police
    </div>
  </div>
      )}
    </div>
  );
};

export default ZoneCard;