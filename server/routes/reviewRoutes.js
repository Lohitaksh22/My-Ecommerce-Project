const express = require('express')
const router = express.Router()
const reviewController = require('../controllers/reviewController')

router.put('/', reviewController.addReview)
router.get('/', reviewController.getReviews)
router.patch('/', reviewController.updateReview)
router.delete('/', reviewController.deleteReview)

module.exports = router
