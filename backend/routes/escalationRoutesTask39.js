const express = require("express");
const router = express.Router();

const EscalationTask39 =
require("../models/EscalationTask39");

router.get("/", async (req, res) => {

  try {

    const escalations =
      await EscalationTask39.find()
      .sort({ createdAt: -1 });

    res.json(escalations);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

});

module.exports = router;