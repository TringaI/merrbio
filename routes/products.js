const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const verifyToken = require('../middlewares/auth');

// @route   GET /products
// @desc    Get all products
// @access  Public
router.get('/', productController.getAllProducts);

// @route   GET /products/:id
// @desc    Get product by ID
// @access  Public
router.get('/:id', productController.getProductById);

// @route   GET /products/category/:categoryId
// @desc    Get products by category
// @access  Public
router.get('/category/:categoryId', productController.getProductsByCategory);

// @route   GET /products/farmer/:farmerId
// @desc    Get products by farmer
// @access  Public
router.get('/farmer/:farmerId', productController.getProductsByFarmer);

// @route   POST /products
// @desc    Create a product
// @access  Private
router.post('/', verifyToken, productController.createProduct);

// @route   PUT /products/:id
// @desc    Update a product
// @access  Private
router.put('/:id', verifyToken, productController.updateProduct);

// @route   DELETE /products/:id
// @desc    Delete a product
// @access  Private
router.delete('/:id', verifyToken, productController.deleteProduct);

module.exports = router;