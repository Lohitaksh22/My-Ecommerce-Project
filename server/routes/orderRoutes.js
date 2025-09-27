const express = require('express')
const router = express.Router()
const orderController = require('../controllers/orderController')


router.post('/', orderController.createOrder)
router.get('/user', orderController.getorderByUser)
router.get('/:id', orderController.getOrderById)
router.patch('/:id', orderController.cancelOrder)
router.delete('/:id', orderController.cancelOrder)

module.exports = router
