const express = require("express");
const router = express.Router();

const EvidenceTask39 =
require("../models/EvidenceTask39");

router.get("/", async (req, res) => {

  try {

    const evidence =
      await EvidenceTask39.find()
      .sort({ createdAt: -1 });

    res.json(evidence);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

});

module.exports = router;