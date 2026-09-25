const express = require("express");
const router = express.Router();

const ReplayTask39 =
require("../models/ReplayTask39");

router.get("/", async (req, res) => {

  try {

    const replay =
      await Replay.find()
      .sort({ createdAt: -1 });

    res.json(replay);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

});

module.exports = router;