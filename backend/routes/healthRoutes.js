const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

router.get("/", (req, res) => {

  const healthData = {
    operationalHealth: 91,

    systems: [
      {
        name: "Transport",
        status: "Stable"
      },
      {
        name: "Healthcare",
        status: "Operational"
      },
      {
        name: "Utilities",
        status: "Elevated"
      }
    ]
  };

  const filePath = path.join(
    __dirname,
    "../data/health.json"
  );

  fs.writeFileSync(
    filePath,
    JSON.stringify(healthData, null, 2)
  );

  res.json(healthData);

});

module.exports = router;