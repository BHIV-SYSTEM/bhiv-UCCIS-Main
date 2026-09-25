const express = require("express");
const router = express.Router();

const {
  getRuntimeHealth
} = require("../controllers/healthController");

router.get("/", getRuntimeHealth);

module.exports = router;