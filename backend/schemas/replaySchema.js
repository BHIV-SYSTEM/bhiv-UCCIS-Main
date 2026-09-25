const Joi = require("joi");

const replaySchema = Joi.object({
  replayId: Joi.string().required(),

  traceId: Joi.string().required(),

  status: Joi.string(),

  executionTime: Joi.number()
});