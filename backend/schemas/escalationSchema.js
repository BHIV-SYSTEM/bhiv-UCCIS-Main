const Joi = require("joi");

const escalationSchema = Joi.object({
  escalationId: Joi.string().required(),

  traceId: Joi.string().required(),

  priority: Joi.string().required(),

  assignedTo: Joi.string(),

  status: Joi.string()
});

module.exports = escalationSchema;