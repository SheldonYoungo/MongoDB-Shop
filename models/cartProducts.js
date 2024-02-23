const { DataTypes } = require('sequelize')

const sequelize = require('../utils/database')

const Cart = require('./cart')
const Product = require('./product')

const CartProducts = sequelize.define('cartProducts', {
  cartId: {
    type: DataTypes.INTEGER,
    references: {
      model: Cart,
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

module.exports = CartProducts
