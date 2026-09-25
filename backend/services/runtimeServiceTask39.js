const signalServiceTask39 =
require("./signalServiceTask39");

const telemetryServiceTask39 =
require("./telemetryServiceTask39");

const incidentServiceTask39 =
require("./incidentServiceTask39");

const escalationServiceTask39 =
require("./escalationServiceTask39");

const replayServiceTask39 =
require("./replayServiceTask39");

const evidenceServiceTask39 =
require("./evidenceServiceTask39");

class RuntimeService {

  async execute(payload) {

    const signal =
      await signalServiceTask39.create(
        payload
      );

    const telemetry =
      await telemetryServiceTask39.generate(
        signal
      );

    const incident =
      await incidentServiceTask39.create(
        signal,
        telemetry
      );

    const escalation =
      await escalationServiceTask39.create(
        incident
      );

    const replay =
      await replayServiceTask39.create(
        escalation
      );

    const evidence =
      await evidenceServiceTask39.create(
        replay
      );

    return {

      signal,

      telemetry,

      incident,

      escalation,

      replay,

      evidence,

      status:
        "COMPLETED"

    };

  }

}

module.exports =
new RuntimeService();