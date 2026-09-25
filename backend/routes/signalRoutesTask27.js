const express = require("express");

const router = express.Router();

const signalController =
require("../controllers/signalController");

router.post(
  "/create",
  signalController.createSignal
);

router.get(
  "/all",
  signalController.getSignals
);

module.exports = router;