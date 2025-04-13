const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const verifyJWT = require('../middlewares/verifyJWT');

// @route   POST /auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', authController.register);

// @route   POST /auth/login
// @desc    Authenticate user
// @access  Public
router.post('/login', authController.login);

// @route   GET /auth/refresh
// @desc    Refresh access token
// @access  Public (with refresh token)
router.get('/refresh', authController.refresh);

// @route   POST /auth/logout
// @desc    Logout user
// @access  Public
router.post('/logout', authController.logout);

// Admin Routes
// @route   GET /auth/users
// @desc    Get all users (admin only)
// @access  Private/Admin
router.get('/users', verifyJWT, authController.getAllUsers);

// @route   DELETE /auth/users/:id
// @desc    Delete a user (admin only)
// @access  Private/Admin
router.delete('/users/:id', verifyJWT, authController.deleteUser);

// @route   PUT /auth/users/:id
// @desc    Update a user (admin only)
// @access  Private/Admin
router.put('/users/:id', verifyJWT, authController.updateUser);

// @route   PUT /auth/users/:id/role
// @desc    Update a user's role (admin only)
// @access  Private/Admin
router.put('/users/:id/role', verifyJWT, authController.updateUserRole);

module.exports = router;