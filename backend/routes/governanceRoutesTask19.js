const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

router.get("/", (req, res) => {

  const governanceData = [
    {
      time: "08:12",
      action: "Rainfall escalation review initiated"
    },
    {
      time: "08:44",
      action: "Field coordination activated"
    },
    {
      time: "09:10",
      action: "Emergency routing approved"
    }
  ];

  const filePath = path.join(
    __dirname,
    "../data/governance.json"
  );

  fs.writeFileSync(
    filePath,
    JSON.stringify(governanceData, null, 2)
  );

  res.json(governanceData);

});

module.exports = router;