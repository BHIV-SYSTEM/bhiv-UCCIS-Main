const express = require("express");

const router = express.Router();

const {
  injectEntropy,
  getEntropyStatus
} = require("../controllers/entropyController");

router.post("/inject", injectEntropy);

router.get("/status", getEntropyStatus);

module.exports = router;