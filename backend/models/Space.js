const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');

const Space = sequelize.define('Space', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  monthlyPrice: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('available', 'full', 'inactive'),
    defaultValue: 'available',
  }
}, {
  timestamps: true,
});

// A Space belongs to a Seller (User)
Space.belongsTo(User, { as: 'seller', foreignKey: 'sellerId' });
User.hasMany(Space, { foreignKey: 'sellerId' });

module.exports = Space;
