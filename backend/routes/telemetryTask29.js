const express = require("express");
const router = express.Router();

const db = require("../database/db");

/*
==================================
GET ALL TELEMETRY EVENTS
==================================
*/
router.get("/", (req, res) => {

  db.query(
    "SELECT * FROM telemetry_events",
    (err, result) => {

      if (err) {
        return res.status(500).json({
          success: false,
          error: err.message
        });
      }

      res.status(200).json({
        success: true,
        count: result.length,
        data: result
      });

    }
  );

});

/*
==================================
GET TELEMETRY EVENT BY PARAM
==================================
*/
router.get("/:id", (req, res) => {

  db.query(
    "SELECT * FROM telemetry_events",
    (err, result) => {

      if (err) {
        return res.status(500).json({
          success: false,
          error: err.message
        });
      }

      res.status(200).json({
        success: true,
        count: result.length,
        data: result
      });

    }
  );

});

module.exports = router;