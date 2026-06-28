const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
      default: '',
    },
    frequency: {
      type: String,
      enum: ['daily', 'weekly'],
      default: 'daily',
    },
    category: {
      type: String,
      enum: ['health', 'fitness', 'learning', 'mindfulness', 'productivity', 'other'],
      default: 'other',
    },
    color: {
      type: String,
      default: '#4f46e5',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

habitSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Habit', habitSchema);
