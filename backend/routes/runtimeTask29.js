const express = require("express");
const router = express.Router();

const db = require("../database/db");

router.get("/", (req, res) => {
  db.query(
    "SELECT * FROM runtime_logs",
    (err, result) => {
      if (err)
        return res.status(500).json({
          success: false,
          error: err.message
        });

      res.json({
        success: true,
        data: result
      });
    }
  );
});

module.exports = router;