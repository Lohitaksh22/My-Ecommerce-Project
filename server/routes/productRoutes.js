const express = require('express')
const Product = require('../controllers/productController')
const router = express.Router()


router.get('/searchList', Product.getAllMatchingProducts)
router.get('/categories', Product.getAllCategories)
router.get('/all', Product.getAllProductListing)
router.get('/find/:id', Product.getProduct)

module.exports = router
