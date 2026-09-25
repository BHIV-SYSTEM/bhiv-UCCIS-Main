const express = require("express");
const router = express.Router();

const {
  getRuntimeChain,
  getRuntimeSummary
} = require("../controllers/runtimeControllerTask28");

router.get("/chain", getRuntimeChain);
router.get("/summary", getRuntimeSummary);

module.exports = router;