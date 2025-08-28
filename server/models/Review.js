const mongoose = require("mongoose") 

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true
    },
    stars: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
  review: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
) 

reviewSchema.index({ user: 1, product: 1 }, { unique: true }) 


reviewSchema.statics.updateProductReviews = async function (productId) {
  const review = await this.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: "$product",
        avgRating: { $avg: "$stars" },
        numReviews: { $sum: 1 }
      }
    }
  ]) 

  if (review.length > 0) {
    await mongoose.model("Product").findByIdAndUpdate(productId, {
      avgRating: review[0].avgRating,
      numReviews: review[0].numReviews
    }) 
  } else {
    await mongoose.model("Product").findByIdAndUpdate(productId, {
      avgRating: 0,
      numReviews: 0
    }) 
  }
} 


reviewSchema.post("save", async function () {
  await this.constructor.updateProductReviews(this.product) 
}) 


reviewSchema.post("remove", async function () {
  await this.constructor.updateProductReviews(this.product) 
}) 

module.exports = mongoose.model("Review", reviewSchema) 
