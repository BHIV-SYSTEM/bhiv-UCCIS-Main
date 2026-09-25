const express = require("express");

const router = express.Router();

const {
  getReplays,
  createReplay,
  runReplay
} = require("../controllers/replayController");

router.get("/", getReplays);
router.post("/", createReplay);
router.post("/run/:id", runReplay);

module.exports = router;