const Review = require('../models/Review');
const Farmer = require('../models/Farmer');

// Get reviews for a farmer
const getFarmerReviews = async (req, res) => {
  try {
    const farmerId = req.params.farmerId;
    
    const reviews = await Review.find({ farmerId })
      .populate('userId', ['firstName', 'lastName', 'profileImage'])
      .sort({ createdAt: -1 });
    
    res.json(reviews);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add a review
const addReview = async (req, res) => {
  try {
    const { farmerId, rating, comment } = req.body;
    const userId = req.user.id;
    
    // Check if farmer exists
    const farmer = await Farmer.findById(farmerId);
    
    if (!farmer) {
      return res.status(404).json({ message: 'Farmer not found' });
    }
    
    // Check if user already reviewed this farmer
    const existingReview = await Review.findOne({ userId, farmerId });
    
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this farmer' });
    }
    
    // Create new review
    const newReview = new Review({
      userId,
      farmerId,
      rating,
      comment
    });
    
    const review = await newReview.save();
    
    // Return populated review
    const populatedReview = await Review.findById(review._id)
      .populate('userId', ['firstName', 'lastName', 'profileImage']);
    
    res.status(201).json(populatedReview);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a review
const updateReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const userId = req.user.id;
    
    // Find the review
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    // Check if user is the author of the review
    if (review.userId.toString() !== userId) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    // Update fields
    if (rating) review.rating = rating;
    if (comment !== undefined) review.comment = comment;
    
    await review.save();
    
    res.json(review);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a review
const deleteReview = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Find the review
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    // Check if user is the author of the review or an admin
    if (review.userId.toString() !== userId && !req.user.roles.includes(9001)) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    await Review.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Review removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getFarmerReviews,
  addReview,
  updateReview,
  deleteReview
};