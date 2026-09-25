const express = require("express");
const router = express.Router();

const {
  getReplay
} = require("../controllers/replayControllerTask32");

router.get(
  "/replay/:traceId",
  getReplay
);

module.exports = router;