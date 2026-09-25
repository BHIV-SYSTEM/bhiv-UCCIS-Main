const express = require("express");
const router = express.Router();

const {
  createSignal
} = require("../controllers/signalControllerTask28");

router.post("/create", createSignal);

module.exports = router;