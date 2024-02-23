const { where } = require('sequelize')
const Cart = require('../models/cart')
const CartProducts = require('../models/cartProducts')
const Product = require('../models/product')
const OrderItems = require('../models/orderItems')

exports.getProducts = async(req, res) => {

  const userCart = await req.user.getCart()

  // Product.findAll()
  //   .then(products => {
  //     res.render('shop/product-list', {
  //       userCart,
  //       products,
  //       pageTitle: 'All Products',
  //       path: '/shop/product-list'
  //     })
  //   })
  //   .catch(err => console.log(err))
  const products = await Product.findAll()

  res.render('shop/product-list', {
    userCart,
    products,
    pageTitle: 'All Products',
    path: '/shop/product-list'
  })
}

exports.getProductDetails = (req, res) => {
  const { productId } = req.params
  Product.findByPk(productId)
    .then(product => {
      res.render('shop/product-detail', {
        product,
        pageTitle: `${product.title} - Details`,
        path: '/products'
      })
    })
    .catch(err => console.log(err))
}

exports.addToCart = async (req, res) => {
  const { productId, cartId } = req.body

  // CartProducts.findOne({ where: { productId, cartId } })
  //   .then(cartItem => {
  //     if (!cartItem) {
  //       return CartProducts.create({
  //         cartId,
  //         productId
  //       })
  //     }

  //     return cartItem.update({ quantity: cartItem.quantity + 1 })
  //   })
  //   .catch(err => console.log(err))
  
  const product = await Product.findByPk(productId)
  const cart = await Cart.findByPk(cartId)
  const cartItem = await CartProducts.findOne({where: {productId, cartId}})

  if (!cartItem) {
    cart.addProduct(product)  
    return res.status(201).redirect('/cart')
  }
  
  cartItem.update({ quantity: cartItem.quantity + 1 })
  res.status(201).redirect('/cart')
}

exports.getCartView = async (req, res) => {
  const cart = await req.user.getCart()
  const products = await cart.getProducts()
  const productsQuantity = await CartProducts.findAll({attributes: ['productId', 'quantity']})
  
  const formattedProducts =  products.map((product, i) => ({
    ...product.dataValues,
    quantity: productsQuantity.find(pQ => pQ.productId === product.id).quantity
  }))

  res.render('shop/cart', {
    products: formattedProducts,
    pageTitle: 'All Products',
    path: '/shop/cart'
  })

}

exports.getCheckoutView = (req, res) => {
  res.status(200).render('shop/checkout', {
    pageTitle: 'Checkout',
    path: '/shop/checkout'
  })
}

exports.getIndexView = async (req, res) => {
  const userCart = await req.user.getCart()

  // Product.findAll()
  //   .then(products => {
  //     res.render('shop/product-list', {
  //       userCart,
  //       products,
  //       pageTitle: 'All Products',
  //       path: '/shop/product-list'
  //     })
  //   })
  //   .catch(err => console.log(err))
  const products = await Product.findAll()

  res.render('shop/product-list', {
    userCart,
    products,
    pageTitle: 'All Products',
    path: '/shop/product-list'
  })
}

exports.getProductListView = (req, res) => {
  res.status(200).render('shop/product-list', {
    pageTitle: 'Product List',
    path: '/shop/product-list'
  })
}

exports.getOrdersView = async (req, res) => {
  const orders = await req.user.getOrders({include: ['products']})
  res.status(200).render('shop/orders', {
    orders,
    pageTitle: 'Orders',
    path: '/orders'
  })
}

exports.postDeleteFromCart = (req, res) => {
  const { productId } = req.body
  
  req.user.getCart()
    .then(cart => {
      cart.removeProduct(productId)
    })
    .catch(err => console.log(err))
  
  res.status(200).redirect('/cart')
}


exports.updateQuantityInCart = async (req, res) => {
  const { productId, productQuantity } = req.body
  
  if (productQuantity <= 0) {
    res.redirect('/deleteFromCart')
  }

  const cart = await req.user.getCart()
  const productToUpdate = await cart.getProducts({ where: { id: productId } })

  productToUpdate[0].cartProducts.update({quantity: productQuantity}, {where: productId})
  res.status(200).redirect('/cart')
}

exports.createOrder = async (req, res) => {
  const cart = await req.user.getCart()
  const products = await cart.getProducts()
  const order = await req.user.createOrder()

  products.map(prod => {
    prod.addOrder(order, { through: { quantity: prod.cartProducts.quantity } })
  })
  await cart.setProducts(null)
  res.status(201).redirect('/orders')
}