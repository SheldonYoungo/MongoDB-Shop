const { DataTypes } = require('sequelize')

const sequelize = require('../utils/database')

const Order = require('./order')
const Product = require('./product')

const orderItems = sequelize.define('orderItem', {
  orderId: {
    type: DataTypes.INTEGER,
    references: {
      model: Order,
      key: 'id'
    }
  },
  productId: {
    type: DataTypes.INTEGER,
    references: {
      model: Product,
      key: 'id'
    }
  },
  quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    allowNull: false
  }
})

module.exports = orderItems
