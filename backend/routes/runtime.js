const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Get all runtime services
router.get("/", (req, res) => {
  db.all(
    "SELECT * FROM runtimes ORDER BY id DESC",
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

// Get runtime by ID
router.get("/:id", (req, res) => {
  db.get(
    "SELECT * FROM runtimes WHERE id = ?",
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

// Add runtime service
router.post("/", (req, res) => {
  const {
    service_name,
    status,
    updated_at
  } = req.body;

  db.run(
    `INSERT INTO runtimes
    (service_name, status, updated_at)
    VALUES (?, ?, ?)`,
    [
      service_name,
      status,
      updated_at
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

// Update runtime status
router.put("/:id", (req, res) => {
  const {
    service_name,
    status,
    updated_at
  } = req.body;

  db.run(
    `UPDATE runtimes
     SET service_name=?,
         status=?,
         updated_at=?
     WHERE id=?`,
    [
      service_name,
      status,
      updated_at,
      req.params.id
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
        updated: this.changes
      });
    }
  );
});

// Delete runtime service
router.delete("/:id", (req, res) => {
  db.run(
    "DELETE FROM runtimes WHERE id = ?",
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