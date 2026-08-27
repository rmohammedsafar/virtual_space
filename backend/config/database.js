const { Sequelize } = require('sequelize');
require('dotenv').config();

// Determine SSL options based on environment
const sslOptions = process.env.DB_SSL === 'true' ? {
  ssl: {
    require: true,
    rejectUnauthorized: false
  }
} : {};

// Connect to MySQL
const sequelize = new Sequelize(
  process.env.DB_NAME || 'quickspace_db',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    logging: false,
    dialectOptions: sslOptions
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ MySQL Database connected successfully.');
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error.message);
  }
};

module.exports = { sequelize, connectDB };
