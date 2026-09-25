const express =
require("express");

const router =
express.Router();

const controller =
require("./signal.controller");

const validate =
require("./signal.validation");

router.post(
  "/",
  validate,
  controller.createSignal
);

router.get(
  "/",
  controller.getSignals
);

module.exports = router;