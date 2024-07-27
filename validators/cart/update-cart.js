const Joi = require("joi");

// Joi schema for validation
const UpdateCartSchema = Joi.object({
  quantity: Joi.number().integer().min(1),
  color: Joi.string(),
  size: Joi.number().integer(),
});

module.exports = UpdateCartSchema;
