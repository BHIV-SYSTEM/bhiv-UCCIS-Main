const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

router.get("/", (req, res) => {

  const fieldData = [
    {
      team: "Drainage Response Unit",
      district: "Mumbai",
      status: "Deploying"
    },
    {
      team: "Traffic Coordination Cell",
      district: "Thane",
      status: "Active"
    },
    {
      team: "Utility Recovery Team",
      district: "MMR",
      status: "Escalated"
    }
  ];

  const filePath = path.join(
    __dirname,
    "../data/field.json"
  );

  fs.writeFileSync(
    filePath,
    JSON.stringify(fieldData, null, 2)
  );

  res.json(fieldData);

});

module.exports = router;