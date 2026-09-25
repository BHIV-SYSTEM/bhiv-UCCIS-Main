const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Get all alerts
router.get("/", (req, res) => {
  db.all(
    "SELECT * FROM alerts ORDER BY id DESC",
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

// Get alert by ID
router.get("/:id", (req, res) => {
  db.get(
    "SELECT * FROM alerts WHERE id = ?",
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

// Create alert
router.post("/", (req, res) => {
  const {
    incident_id,
    alert_type,
    generated_at
  } = req.body;

  db.run(
    `INSERT INTO alerts
    (incident_id, alert_type, generated_at)
    VALUES (?, ?, ?)`,
    [
      incident_id,
      alert_type,
      generated_at
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

// Delete alert
router.delete("/:id", (req, res) => {
  db.run(
    "DELETE FROM alerts WHERE id = ?",
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