const Joi = require("joi");

const updateUserSchema = Joi.object({
  email: Joi.string().email().message("Please provide a valid email address"),
  phoneNumber: Joi.string().min(8).message({
    "string.min": "Password must be at least 11 characters",
  }),
  firstName: Joi.string()
    .max(20)
    .message("First name must not exceed 10 characters"),
  lastName: Joi.string()
    .max(20)
    .message("Last name must not exceed 10 characters"),
});

module.exports = updateUserSchema;
