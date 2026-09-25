const express = require("express");
const router = express.Router();
const db = require("../config/db");

/*
====================================
GET ALL SIGNALS
====================================
*/
router.get("/", (req, res) => {
  db.all(
    "SELECT * FROM signals ORDER BY id DESC",
    [],
    (err, rows) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Failed to fetch signals",
          error: err.message
        });
      }

      res.status(200).json({
        success: true,
        count: rows.length,
        data: rows
      });
    }
  );
});

/*
====================================
GET SIGNAL BY ID
====================================
*/
router.get("/:id", (req, res) => {
  const { id } = req.params;

  db.get(
    "SELECT * FROM signals WHERE id = ?",
    [id],
    (err, row) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Failed to fetch signal",
          error: err.message
        });
      }

      if (!row) {
        return res.status(404).json({
          success: false,
          message: "Signal not found"
        });
      }

      res.status(200).json({
        success: true,
        data: row
      });
    }
  );
});

/*
====================================
CREATE SIGNAL
====================================
*/
router.post("/", (req, res) => {
  const {
    type,
    source_id,
    confidence,
    timestamp
  } = req.body;

  if (!type) {
    return res.status(400).json({
      success: false,
      message: "Signal type is required"
    });
  }

  db.run(
    `
      INSERT INTO signals
      (
        type,
        source_id,
        confidence,
        timestamp
      )
      VALUES (?, ?, ?, ?)
    `,
    [
      type,
      source_id || null,
      confidence || 0,
      timestamp || new Date().toISOString()
    ],
    function (err) {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Failed to create signal",
          error: err.message
        });
      }

      res.status(201).json({
        success: true,
        message: "Signal created successfully",
        signalId: this.lastID
      });
    }
  );
});

/*
====================================
UPDATE SIGNAL
====================================
*/
router.put("/:id", (req, res) => {
  const { id } = req.params;

  const {
    type,
    source_id,
    confidence,
    timestamp
  } = req.body;

  db.run(
    `
      UPDATE signals
      SET
        type = ?,
        source_id = ?,
        confidence = ?,
        timestamp = ?
      WHERE id = ?
    `,
    [
      type,
      source_id,
      confidence,
      timestamp,
      id
    ],
    function (err) {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Failed to update signal",
          error: err.message
        });
      }

      if (this.changes === 0) {
        return res.status(404).json({
          success: false,
          message: "Signal not found"
        });
      }

      res.status(200).json({
        success: true,
        message: "Signal updated successfully"
      });
    }
  );
});

/*
====================================
DELETE SIGNAL
====================================
*/
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  db.run(
    "DELETE FROM signals WHERE id = ?",
    [id],
    function (err) {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Failed to delete signal",
          error: err.message
        });
      }

      if (this.changes === 0) {
        return res.status(404).json({
          success: false,
          message: "Signal not found"
        });
      }

      res.status(200).json({
        success: true,
        message: "Signal deleted successfully"
      });
    }
  );
});

/*
====================================
SIGNAL STATS
====================================
*/
router.get("/stats/summary", (req, res) => {
  db.get(
    `
      SELECT
      COUNT(*) AS totalSignals,
      AVG(confidence) AS averageConfidence
      FROM signals
    `,
    [],
    (err, row) => {
      if (err) {
        return res.status(500).json({
          success: false,
          error: err.message
        });
      }

      res.status(200).json({
        success: true,
        data: row
      });
    }
  );
});

/*
====================================
RECENT SIGNALS
====================================
*/
router.get("/recent/list", (req, res) => {
  db.all(
    `
      SELECT *
      FROM signals
      ORDER BY timestamp DESC
      LIMIT 10
    `,
    [],
    (err, rows) => {
      if (err) {
        return res.status(500).json({
          success: false,
          error: err.message
        });
      }

      res.status(200).json({
        success: true,
        data: rows
      });
    }
  );
});

module.exports = router;