const express = require("express");
const router = express.Router();

const {
  getSignals,
  getSignalById,
  createSignal
} = require("../controllers/signalControllerTask30");

router.get("/", getSignals);

router.get("/:id", getSignalById);

router.post("/", createSignal);

module.exports = router;