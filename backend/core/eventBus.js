const Event = require("../models/Event");

async function emit(type, payload) {

  const event = await Event.create({
    type,
    payload
  });

  return event;
}

module.exports = {
  emit
};