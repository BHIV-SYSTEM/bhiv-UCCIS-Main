const Joi = require("joi");

const incidentSchema = Joi.object({
  incidentId: Joi.string().required(),

  traceId: Joi.string().required(),

  title: Joi.string().required(),

  severity: Joi.string()
    .valid(
      "Low",
      "Medium",
      "High",
      "Critical"
    )
    .required(),

  status: Joi.string(),

  owner: Joi.string()
});

module.exports = incidentSchema;