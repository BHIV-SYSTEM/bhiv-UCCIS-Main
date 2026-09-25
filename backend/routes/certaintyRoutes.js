const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

router.get("/", (req, res) => {

  /* =====================================================
  JSON DATA
  ===================================================== */

  const certaintyData = [
    {
      incident: "Flood Escalation",
      certainty: 94
    },
    {
      incident: "Traffic Reconstruction",
      certainty: 88
    },
    {
      incident: "Utility Failure Replay",
      certainty: 91
    },
    {
      incident: "Field Continuity Replay",
      certainty: 86
    }
  ];

  /* =====================================================
  FILE PATH
  ===================================================== */

  const filePath = path.join(
    __dirname,
    "../data/certainty.json"
  );

  /* =====================================================
  SAVE JSON FILE
  ===================================================== */

  fs.writeFileSync(
    filePath,
    JSON.stringify(certaintyData, null, 2)
  );

  /* =====================================================
  RESPONSE
  ===================================================== */

  res.json({
    message: "certainty.json saved successfully",
    data: certaintyData
  });

});

module.exports = router;