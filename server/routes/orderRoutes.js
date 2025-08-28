const express = require('express')
const router = express.Router()
const orderController = require('../controllers/orderController')


router.put('/', orderController.createOrder)
router.get('/user', orderController.getorderByUser)
router.get('/id', orderController.getOrderById)
router.patch('/', orderController.updateOrder)
router.delete('/', orderController.cancelOrder)

module.exports = router
