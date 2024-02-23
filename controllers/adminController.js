const { DataTypes } = require('sequelize')

const Product = require('../models/product')

exports.getAddProductView = (req, res) => {
  res.status(201).render('admin/edit-product', {
    pageTitle: 'Add product',
    path: '/admin/add-product',
    editingMode: false
  })
}

exports.getAdminProductsListView = (req, res) => {
  Product.findAll()
    .then(products => {
      res.render('admin/products', {
        products,
        pageTitle: 'Admin Products',
        path: '/admin/products'
      })
    })
    .catch(err => console.log(err))
}

exports.getEditProductView = (req, res) => {
  const { edit } = req.query
  const { productId } = req.params

  if (!edit) {
    res.redirect('/')
  }

  Product.findByPk(productId)
    .then(products => {
      if (!products) {
        return res.redirect('/404')
      }
      res.status(201).render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editingMode: edit,
        product: products[0] // because getProduct returns an array of objects but we only want the first object
      })
    })
}

exports.addNewProduct = (req, res) => {
  const { title, imageUrl, price, description } = req.body
  Product.create({ title, imageUrl, price, description })
    .then(response => res.status(201).redirect('/admin/products'))
    .catch(err => console.log(err))
}

exports.postEditProduct = (req, res) => {
  const { productId, title, imageUrl, price, description } = req.body

  Product.findByPk(productId)
    .then(prod => {
      return prod.update({
        title,
        imageUrl,
        price,
        description,
        updatedAt: DataTypes.NOW
      }, { where: { id: prod.id } })
    })
    .then(rows => {
      if (!rows < 1) {
        return res.status(201).redirect('/admin/products')
      }
      throw new Error(`No product found with the current id ${productId}`)
    })
    .catch(err => console.log(err))
}

exports.postDeleteProduct = (req, res) => {
  const { productId } = req.body
  Product.destroy({ where: { id: productId } })
  res.status(200).redirect('/admin/products')
}
