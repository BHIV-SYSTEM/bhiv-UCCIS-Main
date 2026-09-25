const express =
  require("express");

const router =
  express.Router();

const {
  getReplays,
  createReplay
} = require(
  "../controllers/replayControllerTask37"
);

router.get("/", getReplays);

router.post(
  "/",
  createReplay
);

module.exports = router;