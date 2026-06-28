const Joi = require('joi');

const habitSchema = Joi.object({
  title: Joi.string().trim().min(2).max(120).required(),
  description: Joi.string().trim().max(500).allow('').optional(),
  frequency: Joi.string().valid('daily', 'weekly').optional(),
  category: Joi.string()
    .valid('health', 'fitness', 'learning', 'mindfulness', 'productivity', 'other')
    .optional(),
  color: Joi.string()
    .pattern(/^#[0-9A-Fa-f]{6}$/)
    .optional(),
  isActive: Joi.boolean().optional(),
});

const habitUpdateSchema = habitSchema.fork(['title'], (field) => field.optional());

const logSchema = Joi.object({
  completedDate: Joi.date().iso().required(),
  status: Joi.string().valid('completed', 'skipped').optional(),
  notes: Joi.string().trim().max(300).allow('').optional(),
});

module.exports = { habitSchema, habitUpdateSchema, logSchema };
