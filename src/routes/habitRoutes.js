const express = require('express');
const {
  createHabit,
  getHabits,
  updateHabit,
  deleteHabit,
  logHabit,
} = require('../controllers/habitController');
const validate = require('../middleware/validate');
const protect = require('../middleware/auth');
const { habitSchema, habitUpdateSchema, logSchema } = require('../validators/habitValidator');

const router = express.Router();

router.use(protect);

router.post('/', validate(habitSchema), createHabit);
router.get('/', getHabits);
router.put('/:id', validate(habitUpdateSchema), updateHabit);
router.delete('/:id', deleteHabit);
router.post('/:id/log', validate(logSchema), logHabit);

module.exports = router;
