const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const verifyToken = require('../middlewares/auth');

// @route   GET /reviews/farmer/:farmerId
// @desc    Get reviews for a farmer
// @access  Public
router.get('/farmer/:farmerId', reviewController.getFarmerReviews);

// @route   POST /reviews
// @desc    Add a review
// @access  Private
router.post('/', verifyToken, reviewController.addReview);

// @route   PUT /reviews/:id
// @desc    Update a review
// @access  Private
router.put('/:id', verifyToken, reviewController.updateReview);

// @route   DELETE /reviews/:id
// @desc    Delete a review
// @access  Private
router.delete('/:id', verifyToken, reviewController.deleteReview);

module.exports = router;