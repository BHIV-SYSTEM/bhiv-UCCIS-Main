const { task33DB, task33Ready } = require("../config/db");

const ensureTask33Ready = async () => {
  await task33Ready;
};

/*
=====================================================
TRACE IDS
=====================================================
*/

exports.getTraceIds = async (req, res) => {

  try {

    await ensureTask33Ready();

    const [signals] =
      await task33DB.query(`
        SELECT
          signal_id,
          trace_id,
          signal_type,
          source_system,
          severity,
          status,
          created_at
        FROM signals
        ORDER BY created_at DESC
      `);

    const [[signalCount]] =
      await task33DB.query(`
        SELECT COUNT(*) count
        FROM signals
      `);

    const [[telemetryCount]] =
      await task33DB.query(`
        SELECT COUNT(*) count
        FROM telemetry
      `);

    const [[incidentCount]] =
      await task33DB.query(`
        SELECT COUNT(*) count
        FROM incidents
      `);

    const [[escalationCount]] =
      await task33DB.query(`
        SELECT COUNT(*) count
        FROM escalations
      `);

    const [[replayCount]] =
      await task33DB.query(`
        SELECT COUNT(*) count
        FROM replay_events
      `);

    const [[evidenceCount]] =
      await task33DB.query(`
        SELECT COUNT(*) count
        FROM runtime_evidence
      `);

    res.status(200).json({

      success: true,

      counts: {

        signals:
          signalCount.count,

        telemetry:
          telemetryCount.count,

        incidents:
          incidentCount.count,

        escalations:
          escalationCount.count,

        replayEvents:
          replayCount.count,

        evidence:
          evidenceCount.count

      },

      count: signals.length,

      data: signals

    });

  } catch (error) {

    console.error(
      "getTraceIds Error:",
      error
    );

    res.status(500).json({
      success: false,
      error: error.message
    });

  }

};

/*
=====================================================
RUNTIME SUMMARY
=====================================================
*/

exports.getRuntimeSummary =
  async (req, res) => {

    try {

      await ensureTask33Ready();

      const [[signalCount]] =
        await task33DB.query(`
          SELECT COUNT(*) count
          FROM signals
        `);

      const [[telemetryCount]] =
        await task33DB.query(`
          SELECT COUNT(*) count
          FROM telemetry
        `);

      const [[incidentCount]] =
        await task33DB.query(`
          SELECT COUNT(*) count
          FROM incidents
        `);

      const [[escalationCount]] =
        await task33DB.query(`
          SELECT COUNT(*) count
          FROM escalations
        `);

      const [[replayCount]] =
        await task33DB.query(`
          SELECT COUNT(*) count
          FROM replay_events
        `);

      const [[evidenceCount]] =
        await task33DB.query(`
          SELECT COUNT(*) count
          FROM runtime_evidence
        `);

      res.status(200).json({

        success: true,

        summary: {

          signals:
            signalCount.count,

          telemetry:
            telemetryCount.count,

          incidents:
            incidentCount.count,

          escalations:
            escalationCount.count,

          replayEvents:
            replayCount.count,

          evidence:
            evidenceCount.count

        }

      });

    } catch (error) {

      res.status(500).json({
        success: false,
        error: error.message
      });

    }

  };

/*
=====================================================
RUNTIME CHAIN
=====================================================
*/

exports.getRuntimeChain =
  async (req, res) => {

    try {

      await ensureTask33Ready();

      const { traceId } =
        req.params;

      const [rows] =
        await task33DB.query(
          `
          SELECT

          s.trace_id,

          s.signal_type,
          s.status signal_status,

          t.metric_name,
          t.metric_value,

          i.incident_type,
          i.severity incident_severity,

          e.escalation_level,

          r.replay_status,

          ev.origin,
          ev.status evidence_status

          FROM signals s

          LEFT JOIN telemetry t
          ON s.trace_id=t.trace_id

          LEFT JOIN incidents i
          ON s.trace_id=i.trace_id

          LEFT JOIN escalations e
          ON s.trace_id=e.trace_id

          LEFT JOIN replay_events r
          ON s.trace_id=r.trace_id

          LEFT JOIN runtime_evidence ev
          ON s.trace_id=ev.trace_id

          WHERE s.trace_id=?
          `,
          [traceId]
        );

      res.status(200).json({
        success: true,
        count: rows.length,
        data: rows
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        error: error.message
      });

    }

  };