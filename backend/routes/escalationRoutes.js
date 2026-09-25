const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

router.get("/", (req, res) => {

  const escalationData = [
    {
      district: "Mumbai",
      risk: 82,
      entropy: 12,
      trend: "Rising"
    },
    {
      district: "Thane",
      risk: 68,
      entropy: 18,
      trend: "Stable"
    },
    {
      district: "MMR",
      risk: 74,
      entropy: 14,
      trend: "Elevated"
    }
  ];

  const filePath = path.join(
    __dirname,
    "../data/escalation.json"
  );

  fs.writeFileSync(
    filePath,
    JSON.stringify(escalationData, null, 2)
  );

  res.json(escalationData);

});

module.exports = router;