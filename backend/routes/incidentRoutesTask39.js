const express = require("express");
const router = express.Router();

const IncidentTask39 =
require("../models/IncidentTask39");

router.get("/", async (req, res) => {

  try {

    const incidents =
      await Incident.find()
      .sort({ createdAt: -1 });

    res.json(incidents);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

});

module.exports = router;