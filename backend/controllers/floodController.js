const db = require("../config/db");

// -------------------------
// FLOOD PHASE ENGINE
// -------------------------
const generatePhases = (event_id, severity) => {
  return [
    {
      phase: 1,
      name: "Detection",
      status: "COMPLETED",
      message: "Water level anomaly detected"
    },
    {
      phase: 2,
      name: "Alert Generation",
      status: "COMPLETED",
      message: "Alert sent to system"
    },
    {
      phase: 3,
      name: "Escalation",
      status: severity === "HIGH" ? "TRIGGERED" : "COMPLETED",
      message: "Escalation triggered"
    },
    {
      phase: 4,
      name: "Response Activation",
      status: severity === "HIGH" ? "ACTIVE" : "COMPLETED",
      message: "Emergency response activated"
    },
    {
      phase: 5,
      name: "Recovery",
      status: "PENDING",
      message: "Recovery in progress"
    }
  ];
};

// -------------------------
// EXECUTE FLOOD SCENARIO
// -------------------------
exports.executeFloodScenario = async (req, res) => {
  try {
    const { event_id, severity } = req.body;

    if (!event_id || !severity) {
      return res.status(400).json({
        success: false,
        message: "event_id and severity required"
      });
    }

    // ✅ INSERT INCIDENT (NO incident_id)
    const [result] = await db.query(
      "INSERT INTO incidents (event_id, severity) VALUES (?, ?)",
      [event_id, severity]
    );

    const incidentId = result.insertId;

    const phases = generatePhases(event_id, severity);

    const chartData = {
      labels: phases.map(p => p.name),
      values: phases.map(p =>
        p.status === "COMPLETED" ? 100 :
        p.status === "ACTIVE" ? 70 :
        p.status === "TRIGGERED" ? 50 : 20
      )
    };

    res.json({
      success: true,
      message: "Flood scenario executed",
      incident: {
        incident_id: incidentId,
        event_id,
        severity
      },
      phases,
      chartData
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// -------------------------
// GET INCIDENTS
// -------------------------
exports.getIncidents = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM incidents ORDER BY incident_id DESC"
    );

    res.json({
      success: true,
      data: rows
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};