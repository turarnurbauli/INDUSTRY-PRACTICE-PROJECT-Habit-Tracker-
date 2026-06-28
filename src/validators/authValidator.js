const Joi = require('joi');

const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
const phonePattern = /^\+?[0-9\s\-()]{7,20}$/;

const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  email: Joi.string().trim().email().required(),
  password: Joi.string().pattern(passwordPattern).required().messages({
    'string.pattern.base':
      'Password must be at least 8 characters and include uppercase, lowercase, and a number',
  }),
  phone: Joi.string().trim().pattern(phonePattern).allow('').optional(),
});

const loginSchema = Joi.object({
  email: Joi.string().trim().email().required(),
  password: Joi.string().required(),
});

module.exports = { registerSchema, loginSchema, passwordPattern, phonePattern };
