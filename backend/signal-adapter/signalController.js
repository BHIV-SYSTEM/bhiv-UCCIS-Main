const db = require("../config/db");
const { fetchSignals } = require("./signalService");
const { mapSignalToUCCIS } = require("./signalMapper");

const processSignals = async () => {
  const signals = await fetchSignals();

  if (!signals || signals.length === 0) {
    return { status: "NO_SIGNALS_FOUND" };
  }

  const results = [];

  for (const signal of signals) {
    const mapped = mapSignalToUCCIS(signal);

    try {
      // 1. TELEMETRY
      await db.query(
        "INSERT INTO telemetry_events SET ?",
        mapped.telemetry_event
      );

      // 2. INCIDENT
      const [incidentResult] = await db.query(
        "INSERT INTO incidents SET ?",
        mapped.incident
      );

      const incidentId = incidentResult.insertId;

      // 3. ESCALATION
      await db.query(
        "INSERT INTO escalations SET ?",
        {
          ...mapped.escalation,
          incident_id: incidentId
        }
      );

      // 4. REPLAY SESSION
      await db.query(
        "INSERT INTO replay_sessions SET ?",
        {
          ...mapped.replay_session,
          incident_id: incidentId
        }
      );

      // 5. RUNTIME LOG
      await db.query(
        "INSERT INTO runtime_logs SET ?",
        mapped.runtime_log
      );

      results.push({
        signal_id: signal.id,
        status: "PROCESSED"
      });

    } catch (err) {
      console.error("Signal processing error:", err.message);

      results.push({
        signal_id: signal.id,
        status: "FAILED"
      });
    }
  }

  return {
    status: "SIGNAL_PIPELINE_COMPLETE",
    processed: results.length,
    results
  };
};

module.exports = { processSignals };