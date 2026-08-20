const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');
const Space = require('./Space');

const Rental = sequelize.define('Rental', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  planType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('active', 'cancelled', 'pending'),
    defaultValue: 'pending',
  },
  nextBillingDate: {
    type: DataTypes.DATE,
  }
}, {
  timestamps: true,
});

Rental.belongsTo(User, { foreignKey: 'userId' });
Rental.belongsTo(Space, { foreignKey: 'spaceId' });
User.hasMany(Rental, { foreignKey: 'userId' });
Space.hasMany(Rental, { foreignKey: 'spaceId' });

module.exports = Rental;
