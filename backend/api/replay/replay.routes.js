const express = require("express");

const router =
express.Router();

const controller =
require("./replay.controller");

const validate =
require("./replay.validation");

router.post(
  "/",
  validate,
  controller.createReplay
);

router.get(
  "/",
  controller.getReplays
);

router.get(
  "/:id",
  controller.getReplay
);

router.put(
  "/:id",
  controller.updateReplay
);

router.delete(
  "/:id",
  controller.deleteReplay
);

module.exports = router;