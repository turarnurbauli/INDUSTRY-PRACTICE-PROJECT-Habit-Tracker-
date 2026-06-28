const Habit = require('../models/Habit');
const HabitLog = require('../models/HabitLog');

const createHabit = async (req, res, next) => {
  try {
    const habit = await Habit.create({ ...req.body, user: req.user._id });
    res.status(201).json({ success: true, habit });
  } catch (error) {
    next(error);
  }
};

const getHabits = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 50);
    const skip = (page - 1) * limit;

    const filter = { user: req.user._id };

    if (req.query.frequency) {
      filter.frequency = req.query.frequency;
    }

    if (req.query.category) {
      filter.category = req.query.category;
    }

    if (req.query.isActive !== undefined) {
      filter.isActive = req.query.isActive === 'true';
    }

    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search.trim(), 'i');
      filter.$or = [{ title: searchRegex }, { description: searchRegex }];
    }

    const [habits, total] = await Promise.all([
      Habit.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Habit.countDocuments(filter),
    ]);

    const habitIds = habits.map((h) => h._id);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayLogs = await HabitLog.find({
      habit: { $in: habitIds },
      user: req.user._id,
      completedDate: { $gte: today, $lt: tomorrow },
      status: 'completed',
    }).select('habit');

    const completedToday = new Set(todayLogs.map((log) => String(log.habit)));

    const habitsWithStatus = habits.map((habit) => ({
      ...habit.toObject(),
      completedToday: completedToday.has(String(habit._id)),
    }));

    res.status(200).json({
      success: true,
      habits: habitsWithStatus,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

const updateHabit = async (req, res, next) => {
  try {
    const habit = await Habit.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!habit) {
      return res.status(404).json({ success: false, message: 'Habit not found' });
    }

    res.status(200).json({ success: true, habit });
  } catch (error) {
    next(error);
  }
};

const deleteHabit = async (req, res, next) => {
  try {
    const habit = await Habit.findOneAndDelete({ _id: req.params.id, user: req.user._id });

    if (!habit) {
      return res.status(404).json({ success: false, message: 'Habit not found' });
    }

    await HabitLog.deleteMany({ habit: habit._id, user: req.user._id });

    res.status(200).json({ success: true, message: 'Habit deleted successfully' });
  } catch (error) {
    next(error);
  }
};

const logHabit = async (req, res, next) => {
  try {
    const habit = await Habit.findOne({ _id: req.params.id, user: req.user._id });
    if (!habit) {
      return res.status(404).json({ success: false, message: 'Habit not found' });
    }

    const completedDate = new Date(req.body.completedDate);
    completedDate.setHours(0, 0, 0, 0);

    const log = await HabitLog.findOneAndUpdate(
      { habit: habit._id, user: req.user._id, completedDate },
      {
        habit: habit._id,
        user: req.user._id,
        completedDate,
        status: req.body.status || 'completed',
        notes: req.body.notes || '',
      },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json({ success: true, log });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createHabit,
  getHabits,
  updateHabit,
  deleteHabit,
  logHabit,
};
