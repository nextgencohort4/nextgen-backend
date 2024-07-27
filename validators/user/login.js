const Joi = require("joi");

const loginUserSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.base": "Email should be a type of text",
    "string.empty": "Email is required",
    "string.email": "Email must be a valid email address",
    "any.required": "Please provide an email address",
  }),

  password: Joi.string()
    .min(8)
    .pattern(new RegExp("^[a-zA-Z0-9]{8,30}$"))
    .required()
    .messages({
      "string.base": "Password should be a type of text",
      "string.empty": "Password is required",
      "string.min": "Password must be at least 8 characters",
      "any.required": "User must have a password",
    }),
});

module.exports = loginUserSchema;
