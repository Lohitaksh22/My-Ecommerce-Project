const Review = require('../models/Review')
const Product = require('../models/Product')
const mongoose = require('mongoose')


const addReview = async (req, res) => {
  try {
    const userId = req.user.id
    const productId = req.params.id
    if (!mongoose.Types.ObjectId.isValid(productId)) return res.status(404).json({ msg: "Invalid Product Id" })

    const { review, rating } = req.body
    if (!review || !rating) return res.status(400).json({ msg: "Need Review and Rating" })

    const newReview = await (await Review.create({ user: userId, product: productId, stars: rating, review: review }))
      .populate("product", "name")
      .populate("user", "username")

    res.status(200).json({ msg: "Review Created", newReview })
  } catch (err) {
    console.error(err)
    if (err.code === 11000) {
      return res.status(400).json({ msg: "You already reviewed this product" })
    }
    res.status(500)
  }
}


const getReviews = async (req, res) => {
  try {
    const productId = req.params.id
    if (!mongoose.Types.ObjectId.isValid(productId)) return res.status(404).json({ msg: "Invalid Product Id" })

    const foundReviews = await Review.find({ product: productId })
      .populate("product", "name")
      .populate("user", "username")

    res.status(200).json({ msg: "Reviews Found", foundReviews })

  } catch (err) {
    console.error(err)
    res.status(500)

  }
}


const updateReview = async (req, res) => {
  try {
    const userId = req.user.id
    const productId = req.params.id

    if (!mongoose.Types.ObjectId.isValid(productId)) return res.status(404).json({ msg: "Invalid Product Id" })

    const { review, rating } = req.body
    if (!review || !rating) return res.status(400).json({ msg: "Need Review and Rating" })

    const existingReview = await Review.findOne({ user: userId, product: productId })

    if (!existingReview) return res.status(404).json({ msg: "Review not found" })

    existingReview.review = review
    existingReview.stars = rating

    const updatedReview = await existingReview.save()
    await updatedReview.populate("user", "username").populate("product", "name")

    res.status(200).json({ msg: "Review Updated", updatedReview })
  } catch (err) {
    console.error(err)
    res.status(500)
  }
}


const deleteReview = async (req, res) => {
  try {
    const userId = req.user.id
    const productId = req.params.id

    if (!mongoose.Types.ObjectId.isValid(productId))
      return res.status(404).json({ msg: "Invalid Product Id" })

    const review = await Review.findOne({ user: userId, product: productId })

    if (!review) return res.status(404).json({ msg: "Review not found" })

    await review.remove() 
    res.status(200).json({ msg: "Review Deleted" })
  } catch (err) {
    console.error(err)
    res.status(500).json({ msg: "Server Error" })
  }
}


module.exports = {
  addReview,
  getReviews,
  updateReview,
  deleteReview
}