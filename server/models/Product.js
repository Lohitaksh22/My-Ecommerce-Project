const mongoose = require('mongoose');
const schema = mongoose.Schema;


const productSchema = new schema({
  name: {
    type: String,
    required: true,
    index: true
  },
  price: {
    type: Number, 
    required: true,
  },
  description: {
    type: String, 
    required: true,
    index: true
  },
  dateAdded: {
    type: Date,
    default: Date.now
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },

  image: {
    type: String
  },

    avgRating: {
    type: Number,
    default: 0,
  },
  numReviews: {
    type: Number,
    default: 0,
  }
  
});

module.exports = mongoose.model('Product', productSchema);