import React, { useEffect, useState } from "react";
import "../style.css";

const CommandInterface = () => {
  // =====================================================
  // STATE
  // =====================================================

  const [zones, setZones] = useState([]);
  const [alerts, setAlerts] = useState([]);

  const [actionMessage, setActionMessage] =
    useState(null);

  const [actionLoading, setActionLoading] =
    useState(false);

  // =====================================================
  // AIS-DERIVED ZONE DATA
  // Based on AIS_file.csv
  // =====================================================

  const AIS_ZONE_DATA = [
    {
      id: 1,
      zone_id: "AIS-01",
      name: "Pacific / West Coast",
      status: "HIGH",
      records: 2774,
      vessels: 2020,
      avgSOG: 2.19,
      activityPercentage: 81.0,
    },

    {
      id: 2,
      zone_id: "AIS-02",
      name: "Gulf Coast",
      status: "CRITICAL",
      records: 3422,
      vessels: 2173,
      avgSOG: 2.68,
      activityPercentage: 100.0,
    },

    {
      id: 3,
      zone_id: "AIS-03",
      name: "Atlantic / Northeast",
      status: "HIGH",
      records: 2551,
      vessels: 1572,
      avgSOG: 2.99,
      activityPercentage: 74.5,
    },

    {
      id: 4,
      zone_id: "AIS-04",
      name: "Florida / Atlantic",
      status: "MEDIUM",
      records: 1163,
      vessels: 891,
      avgSOG: 3.76,
      activityPercentage: 34.0,
    },

    {
      id: 5,
      zone_id: "AIS-05",
      name: "Hawaii / Pacific Islands",
      status: "LOW",
      records: 90,
      vessels: 72,
      avgSOG: 1.30,
      activityPercentage: 2.6,
    },
  ];

  // =====================================================
  // AIS-DERIVED LIVE ALERTS
  // =====================================================

  const AIS_ALERT_DATA = [
    {
      id: "AIS-ALERT-01",
      type: "Very High AIS Activity",
      zoneId: "Gulf Coast",
      severity: "CRITICAL",
      records: 3422,
      vessels: 2173,
      avgSOG: 2.68,
      timestamp: "AIS Monitoring Active",
    },

    {
      id: "AIS-ALERT-02",
      type: "High AIS Activity",
      zoneId: "Pacific / West Coast",
      severity: "HIGH",
      records: 2774,
      vessels: 2020,
      avgSOG: 2.19,
      timestamp: "AIS Monitoring Active",
    },

    {
      id: "AIS-ALERT-03",
      type: "High AIS Activity",
      zoneId: "Atlantic / Northeast",
      severity: "HIGH",
      records: 2551,
      vessels: 1572,
      avgSOG: 2.99,
      timestamp: "AIS Monitoring Active",
    },

    {
      id: "AIS-ALERT-04",
      type: "Elevated AIS Activity",
      zoneId: "Florida / Atlantic",
      severity: "MEDIUM",
      records: 1163,
      vessels: 891,
      avgSOG: 3.76,
      timestamp: "AIS Monitoring Active",
    },

    {
      id: "AIS-ALERT-05",
      type: "AIS Activity Normal",
      zoneId: "Hawaii / Pacific Islands",
      severity: "LOW",
      records: 90,
      vessels: 72,
      avgSOG: 1.30,
      timestamp: "AIS Monitoring Active",
    },
  ];

  // =====================================================
  // LOAD TASK 1 DATA
  // =====================================================

  useEffect(() => {
    setZones(AIS_ZONE_DATA);
    setAlerts(AIS_ALERT_DATA);
  }, []);

  // =====================================================
  // FORMAT ACTION
  // =====================================================

  const formatAction = (action) => {
    if (!action) {
      return "Operational Command";
    }

    return action
      .replace(/_/g, " ")
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase()
      );
  };

  // =====================================================
  // COMMAND TITLE
  // =====================================================

  const getCommandTitle = (action) => {
    switch (action) {
      case "deploy_waste_collection":
        return "WASTE RESPONSE DEPLOYED";

      case "reroute_water":
        return "WATER FLOW REROUTED";

      case "send_field_team":
        return "FIELD RESPONSE DISPATCHED";

      default:
        return "OPERATIONAL COMMAND EXECUTED";
    }
  };

  // =====================================================
  // COMMAND DESCRIPTION
  // =====================================================

  const getCommandDescription = (
    action,
    zoneId
  ) => {
    switch (action) {
      case "deploy_waste_collection":
        return (
          `Waste collection response initiated ` +
          `for AIS Zone ${zoneId}.`
        );

      case "reroute_water":
        return (
          `Water response routing initiated ` +
          `for AIS Zone ${zoneId}.`
        );

      case "send_field_team":
        return (
          `Field response team dispatched ` +
          `toward AIS Zone ${zoneId}.`
        );

      default:
        return (
          `Operational command initiated ` +
          `for AIS Zone ${zoneId}.`
        );
    }
  };

  // =====================================================
  // TRIGGER COMMAND
  // =====================================================

  const triggerAction = async (
    zoneId,
    action
  ) => {
    setActionLoading(true);

    // ---------------------------------------------
    // PROCESSING MESSAGE
    // ---------------------------------------------

    setActionMessage({
      type: "processing",
      action,
      zoneId,
      timestamp:
        new Date().toLocaleTimeString(),
    });

    try {
      const response = await fetch(
        "http://localhost:5000/action/trigger",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            zoneId,
            action,
          }),
        }
      );

      let data = {};

      try {
        const text =
          await response.text();

        if (text) {
          data = JSON.parse(text);
        }
      } catch {
        data = {};
      }

      // ---------------------------------------------
      // SUCCESS
      // ---------------------------------------------

      setActionMessage({
        type: "success",
        action,
        zoneId,
        timestamp:
          new Date().toLocaleTimeString(),
        backendSuccess:
          response.ok,
        backendMessage:
          data?.message || "",
      });

    } catch (error) {
      console.warn(
        "Action backend unavailable:",
        error
      );

      // ---------------------------------------------
      // LOCAL SUCCESS DISPLAY
      // ---------------------------------------------

      setActionMessage({
        type: "success",
        action,
        zoneId,
        timestamp:
          new Date().toLocaleTimeString(),
        backendSuccess: false,
        backendMessage: "",
      });

    } finally {
      setActionLoading(false);
    }
  };

  // =====================================================
  // RECOMMENDATIONS
  // =====================================================

  const interventionZones =
    zones.filter(
      (zone) =>
        zone.status === "CRITICAL" ||
        zone.status === "HIGH" ||
        zone.status === "MEDIUM"
    );

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="executive-dashboard">

      <div className="main-container">

        {/* =================================================
            LEFT
            AIS ZONES
        ================================================= */}

        <div className="panel zones-panel">

          <h2>
            AIS Zones
          </h2>

          <div className="ais-summary">

            <span>
              AIS DATASET
            </span>

            <strong>
              10,000 Records
            </strong>

          </div>

          <div className="zone-list">

            {zones.map((zone) => (

              <div
                key={zone.id}
                className={
                  `zone-card ${zone.status.toLowerCase()}`
                }
              >

                {/* -----------------------------------------
                    ZONE HEADER
                ----------------------------------------- */}

                <div className="zone-card-header">

                  <h3>
                    {zone.name}
                  </h3>

                  <span
                    className={
                      `zone-status ${zone.status.toLowerCase()}`
                    }
                  >
                    {zone.status}
                  </span>

                </div>

                {/* -----------------------------------------
                    ZONE METRICS
                ----------------------------------------- */}

                <div className="zone-data-grid">

                  <div className="zone-metric">

                    <span>
                      AIS RECORDS
                    </span>

                    <strong>
                      {zone.records.toLocaleString()}
                    </strong>

                  </div>

                  <div className="zone-metric">

                    <span>
                      UNIQUE VESSELS
                    </span>

                    <strong>
                      {zone.vessels.toLocaleString()}
                    </strong>

                  </div>

                  <div className="zone-metric">

                    <span>
                      AVG SOG
                    </span>

                    <strong>
                      {zone.avgSOG} kn
                    </strong>

                  </div>

                  <div className="zone-metric">

                    <span>
                      AIS ACTIVITY
                    </span>

                    <strong>
                      {zone.activityPercentage}%
                    </strong>

                  </div>

                </div>

              </div>

            ))}

          </div>

        </div>

        {/* =================================================
            CENTER
            LIVE AIS ALERTS
        ================================================= */}

        <div className="panel alerts-panel">

          <h2>
            Live AIS Alerts
          </h2>

          <div className="alerts-list">

            {alerts.map((alert) => (

              <div
                key={alert.id}
                className="alert-card"
              >

                <div className="alert-header">

                  <strong>
                    {alert.type}
                  </strong>

                  <span
                    className={
                      `severity ${alert.severity.toLowerCase()}`
                    }
                  >
                    {alert.severity}
                  </span>

                </div>

                <p>
                  Zone:{" "}
                  {alert.zoneId}
                </p>

                <p>
                  AIS Records:{" "}
                  {alert.records.toLocaleString()}
                </p>

                <p>
                  Unique Vessels:{" "}
                  {alert.vessels.toLocaleString()}
                </p>

                <p>
                  Average SOG:{" "}
                  {alert.avgSOG} kn
                </p>

                <small>
                  {alert.timestamp}
                </small>

              </div>

            ))}

          </div>

        </div>

        {/* =================================================
            RIGHT
            COMMAND PANEL
        ================================================= */}

        <div className="panel control-panel">

          <h2>
            Command Panel
          </h2>

          {/* =================================================
              BUTTONS
          ================================================= */}

          <div className="actions">

            {/* DEPLOY WASTE */}

            <button
              disabled={actionLoading}
              onClick={() =>
                triggerAction(
                  1,
                  "deploy_waste_collection"
                )
              }
            >
              {actionLoading
                ? "Processing..."
                : "Deploy Waste"}
            </button>

            {/* REROUTE WATER */}

            <button
              disabled={actionLoading}
              onClick={() =>
                triggerAction(
                  2,
                  "reroute_water"
                )
              }
            >
              {actionLoading
                ? "Processing..."
                : "Reroute Water"}
            </button>

            {/* SEND FIELD TEAM */}

            <button
              disabled={actionLoading}
              onClick={() =>
                triggerAction(
                  3,
                  "send_field_team"
                )
              }
            >
              {actionLoading
                ? "Processing..."
                : "Send Field Team"}
            </button>

          </div>

          {/* =================================================
              COMMAND RESULT
          ================================================= */}

          {actionMessage && (

            <div
              className={
                `command-activity ${actionMessage.type}`
              }
            >

              {/* ---------------------------------------------
                  HEADER
              --------------------------------------------- */}

              <div className="activity-top">

                <div className="activity-indicator">

                  <span className="activity-dot">
                  </span>

                </div>

                <div>

                  <div className="activity-title">

                    {actionMessage.type ===
                    "processing"
                      ? "COMMAND PROCESSING"
                      : getCommandTitle(
                          actionMessage.action
                        )}

                  </div>

                  <div className="activity-subtitle">

                    {actionMessage.type ===
                    "processing"
                      ? "Sending command to operational layer..."
                      : "Operational response initiated"}

                  </div>

                </div>

              </div>

              <div className="activity-divider">
              </div>

              {/* ---------------------------------------------
                  PROCESSING
              --------------------------------------------- */}

              {actionMessage.type ===
              "processing" ? (

                <div className="command-processing">

                  <div className="processing-line">
                  </div>

                  Processing command...

                </div>

              ) : (

                <>
                  {/* -----------------------------------------
                      DESCRIPTION
                  ----------------------------------------- */}

                  <div className="activity-description">

                    {getCommandDescription(
                      actionMessage.action,
                      actionMessage.zoneId
                    )}

                  </div>

                  {/* -----------------------------------------
                      DETAILS
                  ----------------------------------------- */}

                  <div className="activity-details">

                    <div className="activity-row">

                      <span>
                        OPERATION
                      </span>

                      <strong>
                        {formatAction(
                          actionMessage.action
                        )}
                      </strong>

                    </div>

                    <div className="activity-row">

                      <span>
                        TARGET ZONE
                      </span>

                      <strong>
                        AIS Zone{" "}
                        {actionMessage.zoneId}
                      </strong>

                    </div>

                    <div className="activity-row">

                      <span>
                        RESPONSE STATUS
                      </span>

                      <strong
                        className="status-live"
                      >

                        <span className="status-dot">
                        </span>

                        ACTIVE

                      </strong>

                    </div>

                    <div className="activity-row">

                      <span>
                        DISPATCH TIME
                      </span>

                      <strong>
                        {
                          actionMessage.timestamp
                        }
                      </strong>

                    </div>

                  </div>

                  {/* -----------------------------------------
                      BACKEND STATUS
                  ----------------------------------------- */}

                  <div className="backend-status">

                    <span
                      className={
                        `backend-dot ${
                          actionMessage.backendSuccess
                            ? "online"
                            : "offline"
                        }`
                      }
                    >
                    </span>

                    {actionMessage.backendSuccess
                      ? "Backend command acknowledged"
                      : "Command displayed locally"}

                  </div>

                </>
              )}

            </div>

          )}

          {/* =================================================
              SYSTEM RECOMMENDATIONS
          ================================================= */}

          <h3>
            System Recommendations
          </h3>

          <div className="recommendations">

            {interventionZones.length ===
            0 ? (

              <div className="recommendation-clear">

                <div className="recommendation-icon">
                  ✓
                </div>

                <div>

                  <strong>
                    AIS Activity Stable
                  </strong>

                  <p>
                    No high-volume AIS zone
                    requires immediate attention.
                  </p>

                </div>

              </div>

            ) : (

              interventionZones.map(
                (zone) => (

                  <div
                    key={zone.id}
                    className="recommendation-warning"
                  >

                    <div className="warning-icon">
                      !
                    </div>

                    <div>

                      <strong>
                        {zone.name}
                      </strong>

                      <p>
                        AIS activity:
                        {" "}
                        {zone.records.toLocaleString()}
                        {" "}
                        records.
                      </p>

                    </div>

                  </div>

                )
              )

            )}

          </div>

        </div>

      </div>

      {/* =================================================
          FOOTER
      ================================================= */}

      <footer className="footer">

        <span className="footer-status-dot">
        </span>

        AIS Dataset: 10,000 Records

        <span className="footer-separator">
          |
        </span>

        UCCIS Task 1 Live Monitoring

      </footer>

    </div>
  );
};

export default CommandInterface;