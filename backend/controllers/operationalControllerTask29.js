const db = require("../database/db");

function runScenario(
  signalType,
  location,
  incidentType,
  severity,
  escalationLevel,
  decisionText,
  runtimeMessage,
  res
) {

  db.query(
    "INSERT INTO signals(signal_type,location_name) VALUES (?,?)",
    [signalType, location],
    (err, signalResult) => {

      if (err) {
        return res.status(500).json(err);
      }

      const signalId = signalResult.insertId;

      db.query(
        "INSERT INTO telemetry(signal_id,telemetry_data) VALUES (?,?)",
        [signalId, `${signalType} telemetry`],
        (err, telemetryResult) => {

          const telemetryId = telemetryResult.insertId;

          db.query(
            "INSERT INTO incidents(signal_id,incident_type,severity,status) VALUES (?,?,?,?)",
            [signalId, incidentType, severity, "OPEN"],
            (err, incidentResult) => {

              const incidentId = incidentResult.insertId;

              db.query(
                "INSERT INTO escalations(incident_id,escalation_level,assigned_to) VALUES (?,?,?)",
                [incidentId, escalationLevel, "Control Center"],
                (err, escalationResult) => {

                  const escalationId = escalationResult.insertId;

                  db.query(
                    "INSERT INTO decisions(escalation_id,decision_text) VALUES (?,?)",
                    [escalationId, decisionText],
                    (err, decisionResult) => {

                      const replayData = JSON.stringify({
                        timeline: [
                          "Signal Created",
                          "Telemetry Created",
                          "Incident Generated",
                          "Escalation Generated",
                          "Decision Generated"
                        ]
                      });

                      db.query(
                        "INSERT INTO replay_records(incident_id,replay_json) VALUES (?,?)",
                        [incidentId, replayData],
                        (err, replayResult) => {

                          db.query(
                            "INSERT INTO runtime_logs(log_message) VALUES (?)",
                            [runtimeMessage],
                            (err, runtimeResult) => {

                              res.json({
                                success: true,

                                signalId,

                                telemetryId,

                                incidentId,

                                escalationId,

                                decisionId:
                                  decisionResult.insertId,

                                replayId:
                                  replayResult.insertId,

                                runtimeLogId:
                                  runtimeResult.insertId,

                                message:
                                  "Operational Chain Completed"
                              });

                            }
                          );

                        }
                      );

                    }
                  );

                }
              );

            }
          );

        }
      );

    }
  );
}

exports.floodScenario = (req, res) => {

  runScenario(
    "Flood Alert",
    "Zone A",
    "Flood Incident",
    "HIGH",
    "LEVEL-2",
    "Deploy Rescue Teams",
    "Flood Scenario Executed",
    res
  );

};

exports.trafficScenario = (req, res) => {

  runScenario(
    "Traffic Alert",
    "Highway Zone",
    "Traffic Incident",
    "MEDIUM",
    "LEVEL-1",
    "Activate Diversion",
    "Traffic Scenario Executed",
    res
  );

};

exports.medicalScenario = (req, res) => {

  runScenario(
    "Medical Emergency",
    "Sector 4",
    "Medical Incident",
    "CRITICAL",
    "LEVEL-3",
    "Dispatch Ambulance",
    "Medical Scenario Executed",
    res
  );

};

exports.powerScenario = (req, res) => {

  runScenario(
    "Grid Failure",
    "Power Zone",
    "Power Outage",
    "HIGH",
    "LEVEL-2",
    "Restore Grid",
    "Power Scenario Executed",
    res
  );

};

exports.cyberScenario = (req, res) => {

  runScenario(
    "Unauthorized Access",
    "Data Center",
    "Cyber Threat",
    "CRITICAL",
    "LEVEL-3",
    "Block Source IP",
    "Cyber Scenario Executed",
    res
  );

};