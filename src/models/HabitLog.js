const mongoose = require('mongoose');

const habitLogSchema = new mongoose.Schema(
  {
    habit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Habit',
      required: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    completedDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['completed', 'skipped'],
      default: 'completed',
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 300,
      default: '',
    },
  },
  { timestamps: true }
);

habitLogSchema.index({ habit: 1, user: 1, completedDate: 1 }, { unique: true });

module.exports = mongoose.model('HabitLog', habitLogSchema);
