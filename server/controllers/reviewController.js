const Review = require('../models/Review')
const Product = require('../models/Product')
const User = require("../models/Account")
const mongoose = require('mongoose')


const addReview = async (req, res) => {
  try {
    const userId = req.user.id
    const productId = req.params.id
    if (!mongoose.Types.ObjectId.isValid(productId)) return res.status(404).json({ msg: "Invalid Product Id" })

    const { review, rating } = req.body
    if (!review || !rating) return res.status(400).json({ msg: "Need Review and Rating" })

    const existingReview = await Review.findOne({ user: userId, product: productId });
    if (existingReview)
      return res.status(400).json({ msg: "You already reviewed this product" });

    const newReview = await Review.create({ user: userId, product: productId, stars: rating, review });
    await newReview.populate("product", "name");
    await newReview.populate("user", "username");

    res.status(200).json(newReview)
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
      .sort({ createdAt: -1 })

    res.status(200).json(foundReviews)

  } catch (err) {
    console.error(err)
    res.status(500)

  }
}


const updateReview = async (req, res) => {
  try {
    const userId = req.user.id
    const reviewId = req.params.id

    if (!mongoose.Types.ObjectId.isValid(reviewId)) return res.status(404).json({ msg: "Invalid Review Id" })

    const { review, rating } = req.body
    if (!review || !rating) return res.status(400).json({ msg: "Need Review and Rating" })

    const existingReview = await Review.findOne({ _id: reviewId, user: userId })
    if (!existingReview) return res.status(404).json({ msg: "Review not found" })

    existingReview.review = review
    existingReview.stars = rating

    const updatedReview = await existingReview.save()
    await updatedReview.populate("user", "username").populate("product", "name")

    res.status(200).json(updatedReview)
  } catch (err) {
    console.error(err)
    res.status(500)
  }
}


const deleteReview = async (req, res) => {
  try {
    const userId = req.user.id
    const reviewId = req.params.id

    if (!mongoose.Types.ObjectId.isValid(reviewId))
      return res.status(404).json({ msg: "Invalid Review Id" })

    const review = await Review.findById(reviewId)

    if (!review) return res.status(404).json({ msg: "Review not found" })

    await review.deleteOne()
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