const { Sequelize } = require('sequelize');
require('dotenv').config();

// Connect to MySQL
const sequelize = new Sequelize(
  process.env.DB_NAME || 'quickspace_db',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    logging: false,
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
