const express = require('express')
const router = express.Router()
const cartController = require('../controllers/cartController')

router.get('/', cartController.getCart)
router.put('/', cartController.addProductToCart)
router.patch('/', cartController.updateQuantity)
router.patch('/remove', cartController.removeProduct)
router.patch('/clear', cartController.clearCart)
router.delete('/', cartController.deleteCart)
router.get('/total', cartController.getCartTotal)
router.put('/savelater', cartController.saveForLater)

module.exports = router