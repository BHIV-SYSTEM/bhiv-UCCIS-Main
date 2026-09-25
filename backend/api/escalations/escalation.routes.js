const express = require("express");

const router = express.Router();

const controller =
require("./escalation.controller");

const validate =
require("./escalation.validation");

router.post(
  "/",
  validate,
  controller.createEscalation
);

router.get(
  "/",
  controller.getEscalations
);

router.get(
  "/:id",
  controller.getEscalation
);

router.put(
  "/:id",
  controller.updateEscalation
);

router.delete(
  "/:id",
  controller.deleteEscalation
);

module.exports = router;