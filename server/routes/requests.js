const express = require('express');
const router = express.Router();
const purchaseRequestController = require('../controllers/purchaseRequestController');
const verifyToken = require('../middlewares/auth');

// @route   GET /requests/user
// @desc    Get purchase requests for current user (as buyer)
// @access  Private
router.get('/user', verifyToken, purchaseRequestController.getUserRequests);

// @route   GET /requests/farmer
// @desc    Get purchase requests for current user's farm (as seller)
// @access  Private
router.get('/farmer', verifyToken, purchaseRequestController.getFarmerRequests);

// @route   POST /requests
// @desc    Create a new purchase request
// @access  Private
router.post('/', verifyToken, purchaseRequestController.createRequest);

// @route   PUT /requests/:id
// @desc    Update request status (for farmers)
// @access  Private
router.put('/:id', verifyToken, purchaseRequestController.updateRequestStatus);

// @route   PUT /requests/:id/cancel
// @desc    Cancel request (for buyers)
// @access  Private
router.put('/:id/cancel', verifyToken, purchaseRequestController.cancelRequest);

module.exports = router;