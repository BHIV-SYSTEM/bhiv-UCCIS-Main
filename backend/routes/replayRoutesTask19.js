/* =========================================================
UCCIS REPLAY ROUTES
========================================================= */

const express = require("express");

const fs = require("fs");

const path = require("path");

const replayValidator =
  require("../validation/replayValidator");

const router = express.Router();

router.get("/", (req, res) => {

  const replayData = [

    {
      incident:
        "Mumbai Flood Escalation",

      continuity: 91,

      entropy: 11,

      confidence: 94,

      generatedAt:
        new Date().toISOString()
    },

    {
      incident:
        "MMR Traffic Surge",

      continuity: 88,

      entropy: 15,

      confidence: 89,

      generatedAt:
        new Date().toISOString()
    }

  ];

  /* =====================================================
  VALIDATION
  ===================================================== */

  const validation =
    replayValidator(
      replayData[0]
    );

  /* =====================================================
  SAVE FILE
  ===================================================== */

  const filePath = path.join(
    __dirname,
    "../data/replay.json"
  );

  fs.writeFileSync(
    filePath,
    JSON.stringify(
      replayData,
      null,
      2
    )
  );

  /* =====================================================
  RESPONSE
  ===================================================== */

  res.json({

    success: true,

    validation,

    replayData

  });

});

module.exports = router;