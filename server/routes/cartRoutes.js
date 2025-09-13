const express = require('express')
const router = express.Router()
const cartController = require('../controllers/cartController')

router.get('/', cartController.getCart)
router.put('/', cartController.addProductToCart)
router.patch('/clear', cartController.clearCart)
router.delete('/', cartController.deleteCart)
router.get('/total', cartController.getCartTotal)
router.get('/savelater', cartController.getSavedForLater)
router.delete('/savelater', cartController.clearSaved)
router.delete('/savelater/:id', cartController.removeSaveForLater)
router.put('/savelater/:id', cartController.saveForLater)
router.put('/fromsaved/:id', cartController.addFromSaved)
router.patch('/:id', cartController.updateQuantity)
router.patch('/remove/:id', cartController.removeProduct)

module.exports = router