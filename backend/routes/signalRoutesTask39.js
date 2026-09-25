const express = require("express");
const router = express.Router();

const signalService =
require("../services/signalService");

router.get("/", async (req, res) => {

  try {

    const signals =
      await signalService.getAll();

    res.json(signals);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

});

module.exports = router;