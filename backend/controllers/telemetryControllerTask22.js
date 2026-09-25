const fs = require("fs");
const path = require("path");

/*
=========================================================
UCCIS TELEMETRY CONTROLLER
Principal Secretary Demonstration Runtime
=========================================================
*/

const telemetryPath = path.join(
  __dirname,
  "../seed_data/telemetry.json"
);

const logPath = path.join(
  __dirname,
  "../runtime_logs/telemetry.log"
);

/*
=========================================================
UTILITY FUNCTIONS
=========================================================
*/

const readTelemetry = () => {
  try {
    if (!fs.existsSync(telemetryPath)) {
      fs.writeFileSync(
        telemetryPath,
        JSON.stringify([], null, 2)
      );
    }

    const data = fs.readFileSync(
      telemetryPath,
      "utf-8"
    );

    return JSON.parse(data);
  } catch (error) {
    console.log(error);
    return [];
  }
};

const writeTelemetry = (data) => {
  fs.writeFileSync(
    telemetryPath,
    JSON.stringify(data, null, 2)
  );
};

const appendLog = (message) => {
  const timestamp =
    new Date().toISOString();

  const log =
    `[${timestamp}] ${message}\n`;

  fs.appendFileSync(logPath, log);
};

/*
=========================================================
GET ALL TELEMETRY
=========================================================
*/

exports.getTelemetry = (req, res) => {
  try {
    const telemetry = readTelemetry();

    appendLog(
      "Fetched all telemetry records"
    );

    res.status(200).json({
      success: true,
      total: telemetry.length,
      data: telemetry,
    });
  } catch (error) {
    appendLog(
      `Error fetching telemetry: ${error.message}`
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch telemetry",
    });
  }
};

/*
=========================================================
GET TELEMETRY BY ID
=========================================================
*/

exports.getTelemetryById = (
  req,
  res
) => {
  try {
    const telemetry = readTelemetry();

    const item = telemetry.find(
      (t) =>
        t.telemetry_id === req.params.id
    );

    if (!item) {
      appendLog(
        `Telemetry ${req.params.id} not found`
      );

      return res.status(404).json({
        success: false,
        message: "Telemetry not found",
      });
    }

    appendLog(
      `Fetched telemetry ${req.params.id}`
    );

    res.status(200).json({
      success: true,
      data: item,
    });
  } catch (error) {
    appendLog(
      `Error fetching telemetry by id: ${error.message}`
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch telemetry",
    });
  }
};

/*
=========================================================
CREATE TELEMETRY
=========================================================
*/

exports.createTelemetry = (
  req,
  res
) => {
  try {
    const telemetry = readTelemetry();

    const {
      district,
      department,
      status,
      health_score,
      latency,
      severity,
    } = req.body;

    const newTelemetry = {
      telemetry_id:
        "TEL" +
        String(
          telemetry.length + 1
        ).padStart(3, "0"),

      district:
        district || "Pune",

      department:
        department ||
        "Water Management",

      status:
        status || "ACTIVE",

      health_score:
        health_score || 90,

      latency:
        latency || 100,

      severity:
        severity || "LOW",

      created_at:
        new Date().toISOString(),

      runtime_state:
        "RUNNING",
    };

    telemetry.push(newTelemetry);

    writeTelemetry(telemetry);

    appendLog(
      `Created telemetry ${newTelemetry.telemetry_id}`
    );

    res.status(201).json({
      success: true,
      message:
        "Telemetry created successfully",
      data: newTelemetry,
    });
  } catch (error) {
    appendLog(
      `Error creating telemetry: ${error.message}`
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to create telemetry",
    });
  }
};

/*
=========================================================
UPDATE TELEMETRY
=========================================================
*/

exports.updateTelemetry = (
  req,
  res
) => {
  try {
    const telemetry = readTelemetry();

    const index = telemetry.findIndex(
      (t) =>
        t.telemetry_id === req.params.id
    );

    if (index === -1) {
      appendLog(
        `Update failed for ${req.params.id}`
      );

      return res.status(404).json({
        success: false,
        message: "Telemetry not found",
      });
    }

    telemetry[index] = {
      ...telemetry[index],
      ...req.body,
      updated_at:
        new Date().toISOString(),
    };

    writeTelemetry(telemetry);

    appendLog(
      `Updated telemetry ${req.params.id}`
    );

    res.status(200).json({
      success: true,
      message:
        "Telemetry updated successfully",
      data: telemetry[index],
    });
  } catch (error) {
    appendLog(
      `Error updating telemetry: ${error.message}`
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to update telemetry",
    });
  }
};

/*
=========================================================
DELETE TELEMETRY
=========================================================
*/

exports.deleteTelemetry = (
  req,
  res
) => {
  try {
    const telemetry = readTelemetry();

    const filtered =
      telemetry.filter(
        (t) =>
          t.telemetry_id !== req.params.id
      );

    if (
      filtered.length ===
      telemetry.length
    ) {
      appendLog(
        `Delete failed for ${req.params.id}`
      );

      return res.status(404).json({
        success: false,
        message: "Telemetry not found",
      });
    }

    writeTelemetry(filtered);

    appendLog(
      `Deleted telemetry ${req.params.id}`
    );

    res.status(200).json({
      success: true,
      message:
        "Telemetry deleted successfully",
    });
  } catch (error) {
    appendLog(
      `Error deleting telemetry: ${error.message}`
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to delete telemetry",
    });
  }
};

/*
=========================================================
TELEMETRY STATS
=========================================================
*/

exports.getTelemetryStats = (
  req,
  res
) => {
  try {
    const telemetry = readTelemetry();

    const total =
      telemetry.length;

    const active =
      telemetry.filter(
        (t) =>
          t.status === "ACTIVE"
      ).length;

    const degraded =
      telemetry.filter(
        (t) =>
          t.status === "DEGRADED"
      ).length;

    const critical =
      telemetry.filter(
        (t) =>
          t.severity === "CRITICAL"
      ).length;

    const averageHealth =
      total > 0
        ? (
            telemetry.reduce(
              (acc, curr) =>
                acc +
                curr.health_score,
              0
            ) / total
          ).toFixed(2)
        : 0;

    appendLog(
      "Fetched telemetry stats"
    );

    res.status(200).json({
      success: true,
      stats: {
        total,
        active,
        degraded,
        critical,
        averageHealth,
      },
    });
  } catch (error) {
    appendLog(
      `Error fetching stats: ${error.message}`
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch stats",
    });
  }
};

/*
=========================================================
TELEMETRY HEALTH SUMMARY
=========================================================
*/

exports.getTelemetryHealth = (
  req,
  res
) => {
  try {
    const telemetry = readTelemetry();

    const healthy =
      telemetry.filter(
        (t) =>
          t.health_score >= 80
      ).length;

    const warning =
      telemetry.filter(
        (t) =>
          t.health_score >= 50 &&
          t.health_score < 80
      ).length;

    const critical =
      telemetry.filter(
        (t) =>
          t.health_score < 50
      ).length;

    appendLog(
      "Fetched telemetry health summary"
    );

    res.status(200).json({
      success: true,
      health: {
        healthy,
        warning,
        critical,
      },
    });
  } catch (error) {
    appendLog(
      `Error fetching health summary: ${error.message}`
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch health summary",
    });
  }
};