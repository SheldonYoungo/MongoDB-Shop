const path = require('path')

const express = require('express')

const app = express()

const errorController = require('./controllers/errorController')
const Cart = require('./models/cart')
const CartProducts = require('./models/cartProducts')
const Order = require('./models/order')
const OrderItems = require('./models/orderItems')
const Product = require('./models/product')
const User = require('./models/user')
const adminRoutes = require('./routes/adminRoutes')
const shopRoutes = require('./routes/shopRoutes')
const sequelize = require('./utils/database')

app.set('view engine', 'ejs')
app.set('views', 'views')

app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

app.use((req, res, next) => {
  User.findByPk(1)
    .then(user => {
      req.user = user
      next()
    })
    .catch(err => console.log(err))
})

app.use('/admin', adminRoutes)
app.use(shopRoutes)

app.use(errorController.pageNotFound)

User.hasOne(Cart)
Cart.belongsTo(User)
Cart.belongsToMany(Product, { through: CartProducts })
Product.belongsToMany(Cart, { through: CartProducts })
Order.belongsTo(User)
User.hasMany(Order)
Order.belongsToMany(Product, { through: OrderItems })
Product.belongsToMany(Order, { through: OrderItems })

sequelize.sync()
  .then(() => {
    return User.findByPk(1)
  })
  .then(user => {
    if (!user) {
      return User.create({ name: 'Sheldon', email: 'admin@gmail.com' })
        .then(newUser => {
          return newUser.createCart()
        })
    }
    return user
  })
  .then(() => {
    app.listen(3000, () => console.log('Server listening in port 3000'))
  })
  .catch(err => console.log(err))
