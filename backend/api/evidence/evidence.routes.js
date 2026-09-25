const express =
require("express");

const router =
express.Router();

const controller =
require("./evidence.controller");

const validate =
require("./evidence.validation");

router.post(
  "/",
  validate,
  controller.createEvidence
);

router.get(
  "/",
  controller.getEvidence
);

module.exports = router;