const IncidentTask39 =
require("../models/IncidentTask39");

class IncidentService {

  async create(signal, telemetry) {

    return await IncidentTask39.create({

      incidentId:
        `INC-${Date.now()}`,

      signalId:
        signal.signalId,

      traceId:
        `TRACE-${Date.now()}`,

      severity:
        signal.severity,

      telemetryId:
        telemetry._id,

      status:
        "Open"

    });

  }

  async getAll() {

    return await IncidentTask39.find()
      .sort({ createdAt: -1 });

  }

  async countOpen() {

    return await Incident.countDocuments({
      status: "Open"
    });

  }

}

module.exports =
new IncidentService();