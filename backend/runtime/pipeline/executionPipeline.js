const signalService =
require("../../services/signalService");

const telemetryService =
require("../../services/telemetryService");

const incidentService =
require("../../services/incidentService");

const escalationService =
require("../../services/escalationService");

const replayService =
require("../../services/replayService");

const evidenceService =
require("../../services/evidenceService");

const runtimeEvents =
require("../events/runtimeEvents");

class ExecutionPipeline {

  async execute(payload) {

    const startedAt =
      Date.now();

    const signal =
      await signalService.create(
        payload
      );

    runtimeEvents
      .signalCreated(signal);

    const telemetry =
      await telemetryService.generate(
        signal
      );

    const incident =
      await incidentService.create(
        signal,
        telemetry
      );

    runtimeEvents
      .incidentCreated(
        incident
      );

    const escalation =
      await escalationService.create(
        incident
      );

    runtimeEvents
      .escalationCreated(
        escalation
      );

    const replay =
      await replayService.create(
        escalation
      );

    runtimeEvents
      .replayCompleted(
        replay
      );

    const evidence =
      await evidenceService.create(
        replay
      );

    runtimeEvents
      .evidenceStored(
        evidence
      );

    const executionTime =
      Date.now() - startedAt;

    return {

      signal,

      telemetry,

      incident,

      escalation,

      replay,

      evidence,

      executionTime,

      status:
        "SUCCESS"

    };

  }

}

module.exports =
new ExecutionPipeline();