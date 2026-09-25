const express = require("express");
const router = express.Router();
const { task31DB } = require("../config/db");

// GET ALL INCIDENTS
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM incidents"
    );

    res.json(rows);

  } catch (err) {
    console.error("INCIDENTS ERROR:", err);

    res.status(500).json({
      error: "Failed to fetch incidents",
      details: err.message
    });
  }
});

module.exports = router;