const express = require("express");
const router = express.Router();

const db = require("../database/db");

router.get("/", (req, res) => {
  db.query(
    "SELECT * FROM signals ORDER BY signal_id DESC",
    (err, result) => {
      if (err) {
        return res.status(500).json({
          success: false,
          error: err.message
        });
      }

      res.json({
        success: true,
        data: result
      });
    }
  );
});

router.get("/:id", (req, res) => {
  db.query(
    "SELECT * FROM signals WHERE signal_id = ?",
    [req.params.id],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          success: false,
          error: err.message
        });
      }

      res.json({
        success: true,
        data: result
      });
    }
  );
});

module.exports = router;