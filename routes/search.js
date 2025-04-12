const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');

// @route   GET /search
// @desc    Search products by multiple criteria
// @access  Public
router.get('/', searchController.searchProducts);

// @route   GET /search/nearby
// @desc    Get products near a location
// @access  Public
router.get('/nearby', searchController.getNearbyProducts);

module.exports = router;