const express = require("express");
const router = express.Router();

const {
  generateReplay
} = require("../controllers/replayControllerTask28");

router.post("/generate", generateReplay);

module.exports = router;