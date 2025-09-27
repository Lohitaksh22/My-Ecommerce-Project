const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  sessionId: { type: String, unique: true },
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, 
      name: String,   
      price: Number,  
      image: String, 
      quantity: { type: Number, required: true }
    }
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  },
  shippingAddress: {
    type: String,
    required: true,
    default: "No Address Provided"
  },
  deliveryTime: Date,
  price: {
    type: Number,
    default: 0,
    min: 0
  },
  paymentMethod: {
    type: Array,
    required: true,
    default: ["card"] 
  },
  paymentStatus: {
    type: String,
    required: true,
    enum: ["unpaid", "paid", "failed", "refunded"],
    default: "unpaid"
  },
  orderStatus: {
    type: String,
    required: true,
    enum: ["processing", "shipped", "delivered", "canceled"],
    default: "processing"
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  trackingNumber: {
    type: String
  }
})

module.exports = mongoose.model('Order', orderSchema)
