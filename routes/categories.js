const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const verifyToken = require('../middlewares/auth');

// @route   GET /categories
// @desc    Get all categories
// @access  Public
router.get('/', categoryController.getAllCategories);

// @route   GET /categories/:id
// @desc    Get category by ID
// @access  Public
router.get('/:id', categoryController.getCategoryById);

// @route   POST /categories
// @desc    Create a category
// @access  Private/Admin
router.post('/', verifyToken, categoryController.createCategory);

// @route   PUT /categories/:id
// @desc    Update a category
// @access  Private/Admin
router.put('/:id', verifyToken, categoryController.updateCategory);

// @route   DELETE /categories/:id
// @desc    Delete a category
// @access  Private/Admin
router.delete('/:id', verifyToken, categoryController.deleteCategory);

module.exports = router;