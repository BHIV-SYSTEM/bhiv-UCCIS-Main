const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

router.get("/", (req, res) => {

  const alertsData = [
    {
      title: "Mumbai rainfall escalation detected",
      severity: "Critical",
      timestamp: "08:12"
    },
    {
      title: "Drainage overload in South Mumbai",
      severity: "Warning",
      timestamp: "08:24"
    },
    {
      title: "MMR utility instability observed",
      severity: "Moderate",
      timestamp: "08:41"
    }
  ];

  const filePath = path.join(
    __dirname,
    "../data/alerts.json"
  );

  fs.writeFileSync(
    filePath,
    JSON.stringify(alertsData, null, 2)
  );

  res.json(alertsData);

});

module.exports = router;