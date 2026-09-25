// controllers/temporalController.js

const temporalService =
  require("../services/temporalService");

const replayEngine =
  require("../engine/replayEngine");

const auditEngine =
  require("../engine/auditEngine");

const ingestionPipeline =
  require("../data_ingestion/ingestionPipeline");

const tantraSimulator =
  require("../simulator/tantraConvergenceSimulator");

const failureEngine =
  require("../failure/failureEngine");

// =====================================
// UPDATE TEMPORAL STATE
// =====================================

exports.updateTemporalState =
  (req, res) => {

    try {

      const {
        zone_id,
        domains
      } = req.body;

      // =====================================
      // FAILURE ENGINE VALIDATION
      // =====================================

      const validation =
        failureEngine.validate({

          zone_id,

          domains,

          timestamp:
            Date.now(),

          replay:
            true,

          cluster_intelligence: {

            propagated_zones: [1]
          },

          anomalies: [1, 2, 3, 4]
        });

      // =====================================
      // VALIDATION FAILED
      // =====================================

      if (!validation.success) {

        return res
          .status(400)
          .json(validation);
      }

      // =====================================
      // PROCESS TEMPORAL ENGINE
      // =====================================

      const result =
        temporalService.process(

          zone_id,

          domains
        );

      // =====================================
      // SUCCESS RESPONSE
      // =====================================

      res.json({

        success: true,

        data:
          result
      });

    } catch (error) {

      // =====================================
      // INTERNAL FAILURE
      // =====================================

      res.status(500)
        .json({

          success: false,

          trace_visibility:
            "TRACE-" + Date.now(),

          readable_reason:
            error.message,

          recovery_recommendation:
            "Check controller execution flow"
        });
    }
  };

// =====================================
// GET TIMELINE
// =====================================

exports.getTimeline =
  (req, res) => {

    try {

      const zoneId =
        parseInt(
          req.params.zone_id
        );

      const history =
        temporalService
          .getHistory(zoneId);

      // =====================================
      // MISSING HISTORY
      // =====================================

      if (
        !history ||
        history.length === 0
      ) {

        return res
          .status(404)
          .json({

            success: false,

            trace_visibility:
              "TRACE-" + Date.now(),

            readable_reason:
              "Missing history snapshots",

            recovery_recommendation:
              "Run intelligence cycles first"
          });
      }

      // =====================================
      // SUCCESS RESPONSE
      // =====================================

      res.json({

        success: true,

        timeline:
          history
      });

    } catch (error) {

      res.status(500)
        .json({

          success: false,

          trace_visibility:
            "TRACE-" + Date.now(),

          readable_reason:
            error.message,

          recovery_recommendation:
            "Check replay storage"
        });
    }
  };

// =====================================
// GET FULL REPLAY
// =====================================

exports.getReplay =
  (req, res) => {

    try {

      const replay =
        replayEngine
          .getReplay();

      // =====================================
      // REPLAY CORRUPTION
      // =====================================

      if (!replay) {

        return res
          .status(500)
          .json({

            success: false,

            trace_visibility:
              "TRACE-" + Date.now(),

            readable_reason:
              "Replay corruption detected",

            recovery_recommendation:
              "Restore replay journal"
          });
      }

      res.json({

        success: true,

        replay
      });

    } catch (error) {

      res.status(500)
        .json({

          success: false,

          trace_visibility:
            "TRACE-" + Date.now(),

          readable_reason:
            error.message,

          recovery_recommendation:
            "Check replay engine"
        });
    }
  };

// =====================================
// GET REPLAY BY TRACE
// =====================================

exports.getReplayByTrace =
  (req, res) => {

    try {

      const traceId =
        req.params.trace_id;

      const replay =
        replayEngine
          .getReplayByTrace(
            traceId
          );

      // =====================================
      // TRACE NOT FOUND
      // =====================================

      if (!replay) {

        return res
          .status(404)
          .json({

            success: false,

            trace_visibility:
              traceId,

            readable_reason:
              "Replay trace not found",

            recovery_recommendation:
              "Verify trace lineage"
          });
      }

      res.json({

        success: true,

        replay
      });

    } catch (error) {

      res.status(500)
        .json({

          success: false,

          trace_visibility:
            "TRACE-" + Date.now(),

          readable_reason:
            error.message,

          recovery_recommendation:
            "Check replay engine integrity"
        });
    }
  };

// =====================================
// COMPARE STATES
// =====================================

exports.compareStates =
  (req, res) => {

    try {

      const zoneId =
        parseInt(
          req.params.zone_id
        );

      const history =
        temporalService
          .getHistory(zoneId);

      // =====================================
      // NOT ENOUGH HISTORY
      // =====================================

      if (
        !history ||
        history.length < 2
      ) {

        return res.json({

          success: false,

          trace_visibility:
            "TRACE-" + Date.now(),

          readable_reason:
            "Not enough historical states",

          recovery_recommendation:
            "Generate more intelligence cycles"
        });
      }

      const previousState =
        history[
          history.length - 2
        ];

      const currentState =
        history[
          history.length - 1
        ];

      // =====================================
      // SUCCESS RESPONSE
      // =====================================

      res.json({

        success: true,

        comparison: {

          previous_state: {

            trace_id:
              previousState.trace_id,

            final_score:
              previousState.final_score,

            final_level:
              previousState.final_level,

            dominant_domain:
              previousState
                .dominant_domain,

            trend:
              previousState.trend
          },

          current_state: {

            trace_id:
              currentState.trace_id,

            final_score:
              currentState.final_score,

            final_level:
              currentState.final_level,

            dominant_domain:
              currentState
                .dominant_domain,

            trend:
              currentState.trend
          }
        }
      });

    } catch (error) {

      res.status(500)
        .json({

          success: false,

          trace_visibility:
            "TRACE-" + Date.now(),

          readable_reason:
            error.message,

          recovery_recommendation:
            "Check state comparison engine"
        });
    }
  };

// =====================================
// GET AUDIT HISTORY
// =====================================

exports.getAuditHistory =
  (req, res) => {

    try {

      const auditHistory =
        auditEngine
          .getAuditHistory();

      res.json({

        success: true,

        audit_history:
          auditHistory
      });

    } catch (error) {

      res.status(500)
        .json({

          success: false,

          trace_visibility:
            "TRACE-" + Date.now(),

          readable_reason:
            error.message,

          recovery_recommendation:
            "Check audit persistence layer"
        });
    }
  };

// =====================================
// GET TRACE LINEAGE
// =====================================

exports.getLineage =
  (req, res) => {

    try {

      const zoneId =
        req.params.zone_id;

      const lineage =
        auditEngine
          .getLineage(
            zoneId
          );

      res.json({

        success: true,

        lineage
      });

    } catch (error) {

      res.status(500)
        .json({

          success: false,

          trace_visibility:
            "TRACE-" + Date.now(),

          readable_reason:
            error.message,

          recovery_recommendation:
            "Check lineage index"
        });
    }
  };

// =====================================
// GET EXECUTION JOURNAL
// =====================================

exports.getExecutions =
  (req, res) => {

    try {

      const executions =
        auditEngine
          .getExecutions();

      res.json({

        success: true,

        executions
      });

    } catch (error) {

      res.status(500)
        .json({

          success: false,

          trace_visibility:
            "TRACE-" + Date.now(),

          readable_reason:
            error.message,

          recovery_recommendation:
            "Check execution journal"
        });
    }
  };

// =====================================
// INGEST UPSTREAM DATA
// =====================================

exports.ingestUpstreamData =
  (req, res) => {

    try {

      const result =
        ingestionPipeline.execute();

      res.json({

        success: true,

        ingestion:
          result
      });

    } catch (error) {

      res.status(500)
        .json({

          success: false,

          trace_visibility:
            "TRACE-" + Date.now(),

          readable_reason:
            error.message,

          recovery_recommendation:
            "Check ingestion adapters"
        });
    }
  };

// =====================================
// FULL TANTRA CONVERGENCE
// =====================================

exports.runTantraConvergence =
  (req, res) => {

    try {

      const zoneId =
        parseInt(
          req.params.zone_id
        );

      const result =
        tantraSimulator.execute(
          zoneId
        );

      res.json({

        success: true,

        convergence:
          result
      });

    } catch (error) {

      res.status(500)
        .json({

          success: false,

          trace_visibility:
            "TRACE-" + Date.now(),

          readable_reason:
            error.message,

          recovery_recommendation:
            "Check convergence simulator"
        });
    }
  };