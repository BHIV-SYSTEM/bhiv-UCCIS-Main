const express = require("express");

const router = express.Router();

const {
  getReplay
} = require("../controllers/replayControllerTask21");

router.get("/", getReplay);

module.exports = router;