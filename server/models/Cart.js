const mongoose = require('mongoose')
const Schema = mongoose.Schema

const cartSchema = new Schema({
  products: {
    type: [{
      product: {type: mongoose.Schema.Types.ObjectId,  ref: 'Product'},
      quantity: { type: Number, default: 1, min: 0, max: 100 }
    }],
   default: []
    
  },
 
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account'
  },

  savedForLater: {
     type: [{
      product: {type: mongoose.Schema.Types.ObjectId,  ref: 'Product'},
      quantity: { type: Number, default: 1, min: 0, max: 100 }
    }],
    default: []
  }
})


module.exports = mongoose.model('Cart', cartSchema)