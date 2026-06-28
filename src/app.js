const express = require('express');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const habitRoutes = require('./routes/habitRoutes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const createApp = () => {
  const app = express();

  app.use(cors());
  app.use(express.json({ limit: '10kb' }));
  app.use(express.urlencoded({ extended: true }));

  app.use(express.static(path.join(__dirname, '..', 'public')));

  app.get('/api/health', (req, res) => {
    res.status(200).json({ success: true, message: 'Habit Tracker API is running' });
  });

  app.use('/api', authRoutes);
  app.use('/api/habits', habitRoutes);

  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
  });

  app.use(notFound);
  app.use(errorHandler);

  return app;
};

module.exports = createApp;
