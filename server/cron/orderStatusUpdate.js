const cron = require('node-cron') 
const mongoose = require('mongoose') 
const Order = require('../models/Order') 

mongoose.connection.once('open', () => {
  console.log('Starting Cron') 

  cron.schedule('0 * * * *', async () => {
    try {
      const now = new Date() 

      const ordersToShip = await Order.find({
        orderStatus: 'processing',
        paymentStatus: 'paid'
      }) 

      await Promise.all(ordersToShip.map(order => {
        order.orderStatus = "shipped" 
        return order.save() 
      })) 

      const ordersToDeliver = await Order.find({
        orderStatus: 'shipped',
        deliveryTime: { $lte: now }
      }) 

      await Promise.all(ordersToDeliver.map(order => {
        order.orderStatus = "delivered" 
        return order.save() 
      })) 

      console.log(`${ordersToShip.length} orders shipped, ${ordersToDeliver.length} orders delivered at ${now.toISOString()}`) 
    } catch (err) {
      console.error('Cron job error:', err) 
    }
  }) 
}) 
