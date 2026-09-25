const express =
  require("express");

const router =
  express.Router();

const {
  getSignals,
  createSignal
} = require(
  "../controllers/signalControllerTask37"
);

router.get("/", getSignals);

router.post(
  "/",
  createSignal
);

module.exports = router;