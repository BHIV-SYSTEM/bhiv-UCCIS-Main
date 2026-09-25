const express =
  require("express");

const router =
  express.Router();

const replayController =
  require(
    "../modules/replay/replay.controller"
  );

router.get(
  "/",
  replayController.replayAll
);

router.get(
  "/:traceId",
  replayController.replayTrace
);

module.exports =
  router;