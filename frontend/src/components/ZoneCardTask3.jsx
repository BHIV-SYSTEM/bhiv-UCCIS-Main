import React from "react";
import TrafficChart from "./TrafficChart";
import ViolationsChart from "./ViolationsChart";

const ZoneCardTask3 = ({ data }) => {

  // 🛡️ Safety check (prevents crash)
  if (!data || data.error) {
    return <h2 style={{ textAlign: "center" }}>No Data Available</h2>;
  }

  const getRiskColor = () => {
    if (data.risk_score > 90) return "#ff4d4f";   // High → Red
    if (data.risk_score > 70) return "#faad14";   // Medium → Yellow
    return "#52c41a";                             // Low → Green
  };

  const getRiskLabel = () => {
    if (data.risk_score > 90) return "HIGH";
    if (data.risk_score > 70) return "MEDIUM";
    return "LOW";
  };

  const handleAction = () => {
    const request = {
      trace_id: data.trace_id,
      action: "INCREASE_SIGNAL_TIME",
      reason: "Risk score exceeded threshold"
    };

    console.log("=== TANTRA REQUEST ===");
    console.log(request);

    alert("Request sent to Decision Layer (Sarathi)");
  };

  return (
    <div style={styles.card}>
      
      {/* Header */}
      <div style={styles.header}>
        <h2
        style={{
          textAlign: "center",
          color: "#222",
          fontSize: "24px",
          fontWeight: "bold",
          marginBottom: "15px",
        }}
        >
        {data.zone_name || `Zone ${data.zone_id}`}
        </h2>

        <span style={{ ...styles.badge, backgroundColor: getRiskColor() }}>
          {getRiskLabel()}
        </span>
      </div>

      {/* Metrics */}
      <div style={styles.metrics}>
        <div style={styles.metricBox}>
          <p style={styles.label}>Risk Score</p>
          <h1 style={{ ...styles.value, color: getRiskColor() }}>
            {data.risk_score}
          </h1>
        </div>

        <div style={styles.metricBox}>
          <p style={styles.label}>Prediction</p>
          <h1 style={styles.value}>{data.prediction}</h1>
        </div>
      </div>

      {/* Reason */}
      <div style={styles.reasonBox}>
        <p style={styles.label}>Reason</p>
        <p style={styles.reasonText}>{data.reason}</p>
      </div>

      {/* Charts Section */}
      <div style={styles.chartRow}>
        <div style={styles.chartBox}>
          <p style={styles.chartTitle}>Traffic Trend</p>
          <TrafficChart trafficData={data.traffic_history || []} />
        </div>

        <div style={styles.chartBox}>
          <p style={styles.chartTitle}>Violations Trend</p>
          <ViolationsChart violationsData={data.violations_history || []} />
        </div>
      </div>

      {/* Action */}
      {/* <button style={styles.button} onClick={handleAction}>
        Take Action
      </button> */}
    </div>
  );
};

const styles = {
  card: {
    width: "100%",
    minHeight: "50%",
    padding: "5px",
    borderRadius: "16px",
    background: "#ffffff",
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
    fontFamily: "Arial",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between"
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },

  zone: {
    margin: 0,
    fontSize: "20px"
  },

  badge: {
    padding: "6px 12px",
    borderRadius: "10px",
    color: "#fff",
    fontSize: "12px",
    fontWeight: "bold"
  },

  metrics: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "20px"
  },

  metricBox: {
    textAlign: "center"
  },

  label: {
    fontSize: "12px",
    color: "#888",
    marginBottom: "5px"
  },

  value: {
    margin: 0,
    fontSize: "30px"
  },

  reasonBox: {
    marginTop: "20px",
    padding: "14px",
    background: "#f5f5f5",
    borderRadius: "12px"
  },

  reasonText: {
    fontSize: "13px",
    color: "#555",
    lineHeight: "1.5"
  },

  chartRow: {
    display: "flex",
    gap: "12px",
    marginTop: "20px",
    width: "100%"
  },

  chartBox: {
    flex: 1,
    height: "180px",
    padding: "8px",
    background: "#fafafa",
    borderRadius: "12px",
    overflow: "hidden"
  },

  chartTitle: {
    fontSize: "13px",
    color: "#666",
    marginBottom: "5px",
    textAlign: "center"
  },

  button: {
    marginTop: "20px",
    width: "100%",
    padding: "12px",
    border: "none",
    borderRadius: "10px",
    background: "#1890ff",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "0.3s"
  }
};

export default ZoneCardTask3;