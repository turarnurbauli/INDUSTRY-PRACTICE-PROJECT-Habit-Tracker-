require('dotenv').config();
const createApp = require('./src/app');
const connectDB = require('./src/config/db');

const PORT = process.env.PORT || 3000;

const start = async () => {
  if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET is required. Copy .env.example to .env');
    process.exit(1);
  }

  await connectDB();
  const app = createApp();

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

start().catch((error) => {
  console.error('Failed to start server:', error.message);
  process.exit(1);
});
