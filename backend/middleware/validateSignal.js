const Joi = require("joi");

const signalSchema = Joi.object({
  zone_id: Joi.string().required(),
  domain: Joi.string().required(),
  severity: Joi.number().required(),
  confidence: Joi.number().required(),
  timestamp: Joi.string().required()
});

module.exports = (req, res, next) => {

  const { error } = signalSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      status: "FAILED",
      reason: error.details[0].message
    });
  }

  next();
};