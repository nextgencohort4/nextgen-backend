const Joi = require("joi");

const createUserSchema = Joi.object({
  firstName: Joi.string().max(50).required().messages({
    "string.base": "First name should be a type of text",
    "string.empty": "First name is required",
    "string.max": "First name must not be more than fifty characters",
    "any.required": "Please provide a first name",
  }),
  lastName: Joi.string().max(50).required().messages({
    "string.base": "Last name should be a type of text",
    "string.empty": "Last name is required",
    "string.max": "Last name must not be more than fifty characters",
    "any.required": "Please provide a last name",
  }),
  email: Joi.string().email().required().messages({
    "string.base": "Email should be a type of text",
    "string.empty": "Email is required",
    "string.email": "Email must be a valid email address",
    "any.required": "Please provide an email address",
  }),
  phoneNumber: Joi.string().required().min(11).messages({
    "string.base": "Phone number should be a type of text",
    "string.empty": "Phone number is required",
    "any.required": "Please provide a phone number",
    "string.min" : "Password must be at least 11 characters long",
  }),
  password: Joi.string().min(8).pattern(new RegExp("^[a-zA-Z0-9]{8,30}$")).required().messages({
    "string.base": "Password should be a type of text",
    "string.empty": "Password is required",
    "string.min": "Password must be at least 8 characters",
    "any.required": "User must have a password",
  }),
  role:Joi.string().valid('buyer', 'admin').default("buyer"),
});

module.exports = createUserSchema;
