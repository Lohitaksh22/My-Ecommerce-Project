const express = require('express')
const router = express.Router()
const Admin = require('../controllers/adminController')
const verifyAdmin = require('../middleware/verifyAdmin')

router.use(verifyAdmin)

router.get('/accounts', Admin.getAllAccounts)
router.get('/findAccount', Admin.findAccount)
router.patch('/findAccount', Admin.promoteRoles)
router.delete('/findAccount', Admin.deleteAccount)

router.put('productListings', Admin.createProductListing)
router.patch('productListings', Admin.updateProductListing)
router.delete('productListings', Admin.deleteProductListing)
router.get('productListings', Admin.getProductListing)
router.get('allProductListings', Admin.getAllProductListings)
router.get('allOrders', Admin.getAllOrders)
router.get('totalRevenue', Admin.getTotalRevenue)
router.get('totalReviews', Admin.getAllReviews)

module.exports = router