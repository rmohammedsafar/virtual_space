const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const SiteContent = sequelize.define('SiteContent', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  key: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  value: {
    type: DataTypes.TEXT,
    allowNull: false
  }
});

module.exports = SiteContent;
