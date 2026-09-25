const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

/* =========================================================
GET TELEMETRY DATA
========================================================= */

router.get("/", (req, res) => {

  /* =====================================================
  TELEMETRY DATASET
  ===================================================== */

  const telemetryData = [

    {
      service: "Traffic Grid",
      latency: "42ms",
      health: "Operational",
      throughput: "91%",
      district: "Mumbai",
      packets: 12442,
      uptime: "99.2%"
    },

    {
      service: "Police Mesh",
      latency: "64ms",
      health: "Stable",
      throughput: "88%",
      district: "Thane",
      packets: 9841,
      uptime: "97.4%"
    },

    {
      service: "Health Grid",
      latency: "38ms",
      health: "Operational",
      throughput: "95%",
      district: "MMR",
      packets: 14511,
      uptime: "99.6%"
    },

    {
      service: "Utility Coordination",
      latency: "58ms",
      health: "Elevated",
      throughput: "82%",
      district: "Navi Mumbai",
      packets: 8221,
      uptime: "95.8%"
    },

    {
      service: "Emergency Dispatch Network",
      latency: "47ms",
      health: "Operational",
      throughput: "93%",
      district: "South Mumbai",
      packets: 11674,
      uptime: "98.7%"
    }

  ];

  /* =====================================================
  FILE PATH
  ===================================================== */

  const filePath = path.join(
    __dirname,
    "../data/telemetry.json"
  );

  /* =====================================================
  CREATE DATA DIRECTORY IF MISSING
  ===================================================== */

  const dataDir = path.join(
    __dirname,
    "../data"
  );

  if (!fs.existsSync(dataDir)) {

    fs.mkdirSync(dataDir);

  }

  /* =====================================================
  SAVE JSON FILE
  ===================================================== */

  fs.writeFileSync(
    filePath,
    JSON.stringify(telemetryData, null, 2)
  );

  /* =====================================================
  RESPONSE
  ===================================================== */

  res.status(200).json({
    success: true,

    message:
      "telemetry.json generated successfully",

    totalServices:
      telemetryData.length,

    regions: [
      "Mumbai",
      "Thane",
      "MMR"
    ],

    data: telemetryData
  });

});

/* =========================================================
EXPORT ROUTER
========================================================= */

module.exports = router;