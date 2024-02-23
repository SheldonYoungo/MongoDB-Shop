const express = require('express')

const shopController = require('../controllers/shopController')

const router = express.Router()

router.get('/', shopController.getIndexView)
router.get('/product', shopController.getProducts)
router.get('/product/:productId', shopController.getProductDetails)
router.get('/product/delete')
router.get('/cart', shopController.getCartView)
router.get('/index', shopController.getIndexView)
router.get('/orders', shopController.getOrdersView)
// router.get('/product-list', shopController.getProductListView)

router.post('/cart', shopController.addToCart)
router.post('/updateProductQuantity', shopController.updateQuantityInCart)
router.post('/deleteFromCart', shopController.postDeleteFromCart)
router.post('/createOrder', shopController.createOrder)

module.exports = router
