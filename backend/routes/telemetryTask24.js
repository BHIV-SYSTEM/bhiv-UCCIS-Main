const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Get all telemetry
router.get("/", (req, res) => {
  db.all(
    "SELECT * FROM telemetry ORDER BY id DESC",
    [],
    (err, rows) => {
      if (err) {
        return res.status(500).json({
          success: false,
          error: err.message
        });
      }

      res.json({
        success: true,
        count: rows.length,
        data: rows
      });
    }
  );
});

// Get telemetry by ID
router.get("/:id", (req, res) => {
  db.get(
    "SELECT * FROM telemetry WHERE id = ?",
    [req.params.id],
    (err, row) => {
      if (err) {
        return res.status(500).json({
          success: false,
          error: err.message
        });
      }

      res.json({
        success: true,
        data: row
      });
    }
  );
});

// Create telemetry
router.post("/", (req, res) => {
  const {
    signal_id,
    metric_name,
    metric_value,
    captured_at
  } = req.body;

  db.run(
    `INSERT INTO telemetry
    (signal_id, metric_name, metric_value, captured_at)
    VALUES (?, ?, ?, ?)`,
    [
      signal_id,
      metric_name,
      metric_value,
      captured_at
    ],
    function (err) {
      if (err) {
        return res.status(500).json({
          success: false,
          error: err.message
        });
      }

      res.json({
        success: true,
        id: this.lastID
      });
    }
  );
});

// Delete telemetry
router.delete("/:id", (req, res) => {
  db.run(
    "DELETE FROM telemetry WHERE id = ?",
    [req.params.id],
    function (err) {
      if (err) {
        return res.status(500).json({
          success: false,
          error: err.message
        });
      }

      res.json({
        success: true,
        deleted: this.changes
      });
    }
  );
});

module.exports = router;