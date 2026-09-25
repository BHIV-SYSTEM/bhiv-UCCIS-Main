const EventEmitter =
require("events");

class RuntimeBus
extends EventEmitter {}

module.exports =
new RuntimeBus();