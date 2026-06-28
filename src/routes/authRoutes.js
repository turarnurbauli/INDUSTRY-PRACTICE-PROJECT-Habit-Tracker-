const express = require('express');
const { register, login, getProfile } = require('../controllers/authController');
const validate = require('../middleware/validate');
const protect = require('../middleware/auth');
const { registerSchema, loginSchema } = require('../validators/authValidator');

const router = express.Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.get('/profile', protect, getProfile);

module.exports = router;
