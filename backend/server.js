const express = require('express');
const cors = require('cors');
const { connectDB, sequelize } = require('./config/database');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', apiRoutes);

// Sync Database and Start Server
const startServer = async () => {
  await connectDB();
  
  // Sync models with database (creates tables if they don't exist)
  // Use { force: true } only for development if you want to drop tables and recreate them
  try {
    await sequelize.sync();
    console.log('✅ Database models synchronized.');
  } catch (err) {
    console.error('❌ Failed to sync models:', err);
  }

  app.listen(PORT, () => {
    console.log(`🚀 Backend server is running on http://localhost:${PORT}`);
  });
};

startServer();
