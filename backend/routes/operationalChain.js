const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

router.get("/", (req, res) => {
  try {
    const filePath = path.join(
      process.cwd(),
      "datasets",
      "operational_chain.json"
    );

    const data = JSON.parse(
      fs.readFileSync(filePath, "utf8")
    );

    res.json({
      success: true,
      data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;