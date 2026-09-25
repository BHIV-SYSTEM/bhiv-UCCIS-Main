const express =
  require("express");

const router =
  express.Router();

const signalController =
  require(
    "../modules/signals/signal.controller"
  );

router.post(
  "/",
  signalController.createSignal
);

router.get(
  "/",
  signalController.getSignals
);

router.get(
  "/:traceId",
  signalController.getSignal
);

module.exports =
  router;