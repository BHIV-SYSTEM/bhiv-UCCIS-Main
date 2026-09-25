const Joi = require("joi");

const evidenceSchema = Joi.object({
  evidenceId: Joi.string().required(),

  traceId: Joi.string().required(),

  fileName: Joi.string().required(),

  type: Joi.string(),

  uploadedBy: Joi.string()
});

module.exports = evidenceSchema;