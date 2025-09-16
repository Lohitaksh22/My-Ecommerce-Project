const express = require('express')
const router = express.Router()
const reviewController = require('../controllers/reviewController')


router.patch('/:id', reviewController.updateReview)
router.delete('/:id', reviewController.deleteReview)
router.get('/:id', reviewController.getReviews)
router.post('/:id', reviewController.addReview)

module.exports = router
