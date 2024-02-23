const express = require('express')

const adminController = require('../controllers/adminController')

const router = express.Router()

// GET requests
router.get('/add-product', adminController.getAddProductView)
router.get('/products', adminController.getAdminProductsListView)
router.get('/edit-product', adminController.getEditProductView)
router.get('/edit-product/:productId', adminController.getEditProductView)

// admin/add-product => POST
router.post('/add-product', adminController.addNewProduct)
router.post('/edit-product', adminController.postEditProduct)
router.post('/delete-product', adminController.postDeleteProduct)

module.exports = router
