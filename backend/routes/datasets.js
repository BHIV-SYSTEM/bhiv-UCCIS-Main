const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

router.get("/", (req, res) => {
  try {
    const datasetsPath = path.join(
      process.cwd(),
      "datasets"
    );

    if (!fs.existsSync(datasetsPath)) {
      return res.status(404).json({
        success: false,
        message: "datasets folder not found"
      });
    }

    const files = fs
      .readdirSync(datasetsPath)
      .filter((file) => file.endsWith(".json"));

    res.json({
      success: true,
      datasets: files
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

router.get("/:name", (req, res) => {
  try {
    const filePath = path.join(
      process.cwd(),
      "datasets",
      `${req.params.name}.json`
    );

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: "Dataset not found"
      });
    }

    const data = JSON.parse(
      fs.readFileSync(filePath, "utf8")
    );

    res.json({
      success: true,
      count: data.length,
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