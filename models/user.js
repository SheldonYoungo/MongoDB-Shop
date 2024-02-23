const { DataTypes } = require('sequelize')

const sequelize = require('../utils/database')

const User = sequelize.define('user', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(150),
    unique: true,
    allowNull: false
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValues: DataTypes.NOW
  }
})

module.exports = User
