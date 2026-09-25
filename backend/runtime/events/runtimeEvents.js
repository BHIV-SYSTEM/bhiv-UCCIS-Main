const bus =
require("./eventBus");

exports.signalCreated =
payload => {

  bus.emit(
    "signal.created",
    payload
  );

};

exports.incidentCreated =
payload => {

  bus.emit(
    "incident.created",
    payload
  );

};

exports.escalationCreated =
payload => {

  bus.emit(
    "escalation.created",
    payload
  );

};

exports.replayCompleted =
payload => {

  bus.emit(
    "replay.completed",
    payload
  );

};

exports.evidenceStored =
payload => {

  bus.emit(
    "evidence.stored",
    payload
  );

};