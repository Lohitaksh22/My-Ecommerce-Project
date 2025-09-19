const Order = require('../models/Order')
const cartService = require('../services/cartService')
const { default: mongoose } = require('mongoose');
const { v4: uuidv4 } = require('uuid')
const Stripe = require('stripe')
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)


const createOrder = async (req, res) => {
  try {

    const { sessionId, shippingAddress } = req.body
    if (!sessionId) return res.status(400).json({ msg: "No Stripe Session ID" })


    const session = await stripe.checkout.sessions.retrieve(sessionId, {expand: ['shipping'] })
    if (session.payment_status !== "paid") {
      return res.status(400).json({ msg: "Payment not completed" })
    }

    const userId = req.user.id
    if (!mongoose.Types.ObjectId.isValid(userId)) return res.status(404).json({ msg: "Invalid User Id" })

    const Cart = await cartService.getCart(userId)
    if (!Cart) return res.status(404).json({ msg: "No Cart Found" })

    const orderProducts = cartService.mapProductsForOrder(Cart);
    const totalPrice = cartService.total(Cart)

    const deliveryMapping = {
      oneDay: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      twoDay: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      fiveDay: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    }

    const deliveryTime = deliveryMapping[req.body.deliveryTime] || deliveryMapping.oneDay;
 
    


    const newOrder = await Order.create({
      products: orderProducts,
      user: userId,
      shippingAddress: shippingAddress,
      deliveryTime: deliveryTime,
      paymentMethod: session.payment_method_types,
      price: totalPrice,
      trackingNumber: "ORD-" + uuidv4(),
      paymentStatus: session.payment_status
    })

    await cartService.clearCart(Cart._id);

    res.status(200).json({
      msg: 'Order Created',
      Order: newOrder
    })

  } catch (err) {
    console.error(err)
    res.sendStatus(500)

  }
}


const getOrderById = async (req, res) => {
  try {
    const orderId = req.params.id
    if (!mongoose.Types.ObjectId.isValid(orderId)) return res.status(404).json({ msg: "Invalid Order Id" })

    const foundOrder = await Order.findById(orderId).populate('user', 'username email')
    if (!foundOrder) return res.status(404).json({ msg: "Order not Found" })

    if (foundOrder.user._id.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Not authorized to view this order" });
    }


    res.status(200).json({
      msg: "Found Order",
      order: foundOrder
    })
  } catch (err) {
    console.error(err)
    res.sendStatus(500)

  }
}


const getorderByUser = async (req, res) => {
  try {
    const userId = req.user.id
    if (!mongoose.Types.ObjectId.isValid(userId)) return res.status(404).json({ msg: "Invalid User Id" })

    const foundOrders = await Order.find({ user: userId }).populate('user', 'username email').sort({ createdAt: -1 })
    if (!foundOrders || foundOrders.length === 0) return res.status(404).json({ msg: "No Orders Found" })

    res.status(200).json({
      msg: "Orders found",
      orders: foundOrders
    })

  } catch (err) {
    console.error(err)
    res.sendStatus(500)

  }
}


const updateOrder = async (req, res) => {
  try {
    const orderId = req.params.id
    if (!mongoose.Types.ObjectId.isValid(orderId)) return res.status(404).json({ msg: "Invalid Order Id" })

    const foundOrder = await Order.findById(orderId).populate('user', 'username email')
    if (!foundOrder) return res.status(404).json({ msg: "Order not Found" })

    if (foundOrder.user._id.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Not authorized to view this order" });
    }

    if (req.body.paymentStatus) {
      foundOrder.paymentStatus = req.body.paymentStatus;
    }
    if (req.body.orderStatus) {
      foundOrder.orderStatus = req.body.orderStatus;
    }



    await foundOrder.save()
    res.status(200).json({ msg: "Order Updated", order: foundOrder })

  } catch (err) {
    console.error(err)
    res.sendStatus(500)

  }
}

const cancelOrder = async (req, res) => {
  try {
    const orderId = req.params.id
    if (!mongoose.Types.ObjectId.isValid(orderId)) return res.status(404).json({ msg: "Invalid Order Id" })

    const foundOrder = await Order.findById(orderId).populate('user', 'username email')
    if (!foundOrder) return res.status(404).json({ msg: "Order not Found" })

    if (foundOrder.user._id.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Not authorized to view this order" });
    }

    if (['shipped', 'delivered'].includes(foundOrder.orderStatus)) {
      return res.status(400).json({ msg: "Cannot cancel shipped or delivered orders" });
    }

    foundOrder.orderStatus = 'canceled'
    foundOrder.paymentStatus = 'refunded'

    await foundOrder.save()

    res.status(200).json({ msg: "Order Canceled", order: foundOrder })

  } catch (err) {
    console.error(err)
    res.sendStatus(500)

  }
}


module.exports = {
  createOrder,
  getOrderById,
  getorderByUser,
  updateOrder,
  cancelOrder
}