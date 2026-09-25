const SignalEngine =
  require("../services/SignalRuntimeEngine");

const IncidentEngine =
  require("../services/IncidentEngine");

const EscalationEngine =
  require("../services/EscalationEngine");

const ReplayEngine =
  require("../services/ReplayEngine");

const EvidenceEngine =
  require("../services/EvidenceEngine");

const AnalyticsEngine =
  require("../services/AnalyticsEngine");

const ObservabilityEngine =
  require("../services/ObservabilityEngine");

class RuntimeOrchestrator {

  async execute(signal) {

    console.log(
      "Runtime Started",
      signal.traceId
    );

    const signalResult =
      await SignalEngine.process(signal);

    const incident =
      await IncidentEngine.createIncident({
        traceId: signal.traceId,
        metric: "CPU Usage",
        value: 95
      });

    const escalation =
      await EscalationEngine.escalate(
        incident
      );

    const replay =
      await ReplayEngine.execute(
        escalation.traceId
      );

    const evidence =
      await EvidenceEngine.collect(
        replay
      );

    const analytics =
      await AnalyticsEngine.process(
        evidence.traceId
      );

    const observability =
      await ObservabilityEngine.publish({
        traceId: analytics.traceId
      });

    return {
      signalResult,
      incident,
      escalation,
      replay,
      evidence,
      analytics,
      observability
    };
  }

}

module.exports =
  new RuntimeOrchestrator();