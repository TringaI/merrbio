const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const verifyToken = require('../middlewares/auth');

// @route   POST /users/register
// @desc    Register a new user
// @access  Public
router.post('/register', usersController.registerUser);

// @route   GET /users/me
// @desc    Get current user profile
// @access  Private
router.get('/me', verifyToken, usersController.getUserProfile);

// @route   PUT /users/me
// @desc    Update user profile
// @access  Private
router.put('/me', verifyToken, usersController.updateUserProfile);

// @route   GET /users/search
// @desc    Search users by name or email
// @access  Private
router.get('/search', verifyToken, usersController.searchUsers);

module.exports = router;