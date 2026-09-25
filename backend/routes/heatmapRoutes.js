const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

router.get("/", (req, res) => {

  const heatmapData = [
    {
      zone: "South Mumbai",
      load: 92
    },
    {
      zone: "Thane West",
      load: 74
    },
    {
      zone: "Navi Mumbai",
      load: 61
    },
    {
      zone: "Kalyan",
      load: 85
    }
  ];

  const filePath = path.join(
    __dirname,
    "../data/heatmap.json"
  );

  fs.writeFileSync(
    filePath,
    JSON.stringify(heatmapData, null, 2)
  );

  res.json(heatmapData);

});

module.exports = router;