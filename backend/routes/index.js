const express =
require("express");

const router =
express.Router();

router.use(
  "/signals",
  require(
    "../api/signals/signal.routes"
  )
);

router.use(
  "/incidents",
  require(
    "../api/incidents/incident.routes"
  )
);

router.use(
  "/escalations",
  require(
    "../api/escalations/escalation.routes"
  )
);

router.use(
  "/replay",
  require(
    "../api/replay/replay.routes"
  )
);

router.use(
  "/evidence",
  require(
    "../api/evidence/evidence.routes"
  )
);

router.use(
  "/telemetry",
  require(
    "../api/telemetry/telemetry.routes"
  )
);

router.use(
  "/health",
  require(
    "./healthRoutes"
  )
);

router.use(
  "/dashboard",
  require(
    "./dashboardRoutes"
  )
);

router.use(
  "/runtime",
  require(
    "./runtimeRoutes"
  )
);

module.exports =
router;