const express = require('express');
const router = express.Router();
const farmersController = require('../controllers/farmersController');
const verifyToken = require('../middlewares/auth');

// @route   GET /farmers
// @desc    Get all farmers
// @access  Public
router.get('/', farmersController.getAllFarmers);

// @route   GET /farmers/nearby
// @desc    Get nearby farmers
// @access  Public
router.get('/nearby', farmersController.getNearbyFarmers);

// @route   GET /farmers/search
// @desc    Search farmers by name, farm name or description
// @access  Private
router.get('/search', verifyToken, farmersController.searchFarmers);

// @route   GET /farmers/:id
// @desc    Get farmer by ID
// @access  Public
router.get('/:id', farmersController.getFarmerById);

// @route   POST /farmers
// @desc    Create or update farmer profile
// @access  Private
router.post('/', verifyToken, farmersController.createUpdateFarmer);

// @route   DELETE /farmers/:id
// @desc    Delete farmer profile
// @access  Private
router.delete('/:id', verifyToken, farmersController.deleteFarmer);

// @route   PUT /farmers/:id/verify
// @desc    Verify a farmer
// @access  Private/Admin
router.put('/:id/verify', verifyToken, farmersController.verifyFarmer);

module.exports = router;