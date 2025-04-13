const PurchaseRequest = require('../models/PurchaseRequest');
const Product = require('../models/Product');
const Farmer = require('../models/Farmer');

// Get all purchase requests (admin only)
const getAllRequests = async (req, res) => {
  try {
    // Check if user has admin role
    if (!req.user.roles || (!req.user.roles.Admin && !req.user.roles.SuperAdmin)) {
      return res.status(403).json({ message: 'Not authorized for this action' });
    }
    
    const requests = await PurchaseRequest.find()
      .populate('userId', ['firstName', 'lastName', 'email', 'phone'])
      .populate('productId', ['name', 'price', 'unit', 'images'])
      .populate('farmerId', ['farmName']);
    
    res.json(requests);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get purchase requests for the current user (as buyer)
const getUserRequests = async (req, res) => {
  try {
    const requests = await PurchaseRequest.find({ userId: req.user.id })
      .populate('productId', ['name', 'price', 'unit', 'images'])
      .populate('farmerId', ['farmName']);
    
    res.json(requests);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get purchase requests for the current user's farm (as seller)
const getFarmerRequests = async (req, res) => {
  try {
    // Find farmer associated with current user
    const farmer = await Farmer.findOne({ userId: req.user.id });
    
    if (!farmer) {
      return res.status(404).json({ message: 'Farmer profile not found' });
    }
    
    const requests = await PurchaseRequest.find({ farmerId: farmer._id })
      .populate('userId', ['firstName', 'lastName', 'email', 'phone'])
      .populate('productId', ['name', 'price', 'unit', 'images']);
    
    res.json(requests);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new purchase request
const createRequest = async (req, res) => {
  try {
    const { productId, quantity, message, deliveryAddress, contactPhone } = req.body;
    
    // Find the product
    const product = await Product.findById(productId);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Check if quantity is available
    if (quantity > product.quantity) {
      return res.status(400).json({ message: 'Requested quantity exceeds available stock' });
    }
    
    const totalPrice = product.price * quantity;
    
    const newRequest = new PurchaseRequest({
      userId: req.user.id,
      productId,
      farmerId: product.farmerId,
      quantity,
      totalPrice,
      message: message || '',
      deliveryAddress,
      contactPhone
    });
    
    const request = await newRequest.save();
    
    // Return populated request
    const populatedRequest = await PurchaseRequest.findById(request._id)
      .populate('productId', ['name', 'price', 'unit', 'images'])
      .populate('farmerId', ['farmName']);
    
    res.status(201).json(populatedRequest);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update request status (for farmers)
const updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['pending', 'accepted', 'rejected', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    const request = await PurchaseRequest.findById(req.params.id);
    
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    
    // Check if the user is the owner of the farm
    const farmer = await Farmer.findById(request.farmerId);
    
    if (!farmer) {
      return res.status(404).json({ message: 'Farmer not found' });
    }
    
    if (farmer.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    // If accepting the request, check if quantity is still available
    if (status === 'accepted') {
      const product = await Product.findById(request.productId);
      
      if (request.quantity > product.quantity) {
        return res.status(400).json({ message: 'Requested quantity exceeds available stock' });
      }
      
      // Update product quantity
      await Product.findByIdAndUpdate(request.productId, {
        $inc: { quantity: -request.quantity }
      });
    }
    
    // If rejecting or cancelling a previously accepted request, return the quantity
    if ((status === 'rejected' || status === 'cancelled') && request.status === 'accepted') {
      await Product.findByIdAndUpdate(request.productId, {
        $inc: { quantity: request.quantity }
      });
    }
    
    request.status = status;
    await request.save();
    
    res.json(request);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Cancel request (for buyers)
const cancelRequest = async (req, res) => {
  try {
    const request = await PurchaseRequest.findById(req.params.id);
    
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    
    // Check if the user is the buyer
    if (request.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    // Check if the request can be cancelled (only pending requests can be cancelled)
    if (request.status !== 'pending') {
      return res.status(400).json({ message: 'Cannot cancel request with status: ' + request.status });
    }
    
    request.status = 'cancelled';
    await request.save();
    
    res.json(request);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getUserRequests,
  getFarmerRequests,
  getAllRequests,
  createRequest,
  updateRequestStatus,
  cancelRequest
};