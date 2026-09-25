const express =
  require("express");

const router =
  express.Router();

const temporalController =
  require("../controllers/temporalController");

// =====================================
// TEMPORAL INTELLIGENCE UPDATE
// =====================================

router.post(

  "/update",

  temporalController
    .updateTemporalState
);

// =====================================
// FULL REPLAY HISTORY
// =====================================

router.get(

  "/replay",

  temporalController
    .getReplay
);

// =====================================
// REPLAY BY TRACE ID
// =====================================

router.get(

  "/replay/:trace_id",

  temporalController
    .getReplayByTrace
);

// =====================================
// TIMELINE BY ZONE
// =====================================

router.get(

  "/timeline/:zone_id",

  temporalController
    .getTimeline
);

// =====================================
// COMPARE PREVIOUS VS CURRENT
// =====================================

router.get(

  "/compare/:zone_id",

  temporalController
    .compareStates
);

// =====================================
// IMMUTABLE AUDIT HISTORY
// =====================================

router.get(

  "/audit",

  temporalController
    .getAuditHistory
);

// =====================================
// TRACE LINEAGE
// =====================================

router.get(

  "/lineage/:zone_id",

  temporalController
    .getLineage
);

// =====================================
// EXECUTION JOURNAL
// =====================================

router.get(

  "/executions",

  temporalController
    .getExecutions
);

// =====================================
// REAL UPSTREAM INGESTION
// =====================================

router.get(

  "/ingest",

  temporalController
    .ingestUpstreamData
);

// =====================================
// FULL TANTRA CONVERGENCE
// =====================================

router.get(

  "/convergence/:zone_id",

  temporalController
    .runTantraConvergence
);

module.exports =
  router;