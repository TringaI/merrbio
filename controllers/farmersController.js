const Farmer = require('../models/Farmer');
const User = require('../models/User');

// Get all farmers
const getAllFarmers = async (req, res) => {
  try {
    const farmers = await Farmer.find({ active: true })
      .populate('userId', ['firstName', 'lastName', 'profileImage']);
    
    res.json(farmers);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get farmer by ID
const getFarmerById = async (req, res) => {
  try {
    const farmer = await Farmer.findById(req.params.id)
      .populate('userId', ['firstName', 'lastName', 'profileImage']);
    
    if (!farmer) {
      return res.status(404).json({ message: 'Farmer not found' });
    }
    
    res.json(farmer);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get nearby farmers
const getNearbyFarmers = async (req, res) => {
  try {
    const { lat, lng, distance = 10 } = req.query;
    
    if (!lat || !lng) {
      return res.status(400).json({ message: 'Location coordinates required' });
    }
    
    const farmers = await Farmer.find({
      active: true,
      'location.coordinates': {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: parseFloat(distance) * 1000 // Convert km to meters
        }
      }
    }).populate('userId', ['firstName', 'lastName', 'profileImage']);
    
    res.json(farmers);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create or update farmer profile
const createUpdateFarmer = async (req, res) => {
  try {
    const { farmName, description, farmerImages, location, phone, email } = req.body;
    const userId = req.user.id;
    
    // Check if farmer profile already exists for this user
    let farmer = await Farmer.findOne({ userId });
    
    if (farmer) {
      // Update existing farmer profile
      farmer = await Farmer.findOneAndUpdate(
        { userId },
        { 
          $set: { 
            farmName, 
            description, 
            location, 
            phone, 
            email,
            active: true
          },
          $addToSet: { farmerImages: { $each: farmerImages || [] } }
        },
        { new: true }
      );
    } else {
      // Create new farmer profile
      farmer = new Farmer({
        userId,
        farmName,
        description,
        farmerImages: farmerImages || [],
        location,
        phone,
        email
      });
      
      await farmer.save();
      
      // Update user roles to include Farmer role
      await User.findByIdAndUpdate(userId, {
        $set: { 'roles.Farmer': 3001 }
      });
    }
    
    res.json(farmer);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete farmer profile (soft delete by setting active to false)
const deleteFarmer = async (req, res) => {
  try {
    const farmer = await Farmer.findById(req.params.id);
    
    if (!farmer) {
      return res.status(404).json({ message: 'Farmer not found' });
    }
    
    // Check if user owns this farmer profile or is admin
    if (farmer.userId.toString() !== req.user.id && !req.user.roles.includes(9001)) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    await Farmer.findByIdAndUpdate(req.params.id, { active: false });
    
    res.json({ message: 'Farmer profile removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Verify farmer (admin only)
const verifyFarmer = async (req, res) => {
  try {
    // Check if user is admin
    if (!req.user.roles.includes(9001)) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    const farmer = await Farmer.findById(req.params.id);
    
    if (!farmer) {
      return res.status(404).json({ message: 'Farmer not found' });
    }
    
    farmer.verified = true;
    await farmer.save();
    
    res.json({ message: 'Farmer verified', farmer });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllFarmers,
  getFarmerById,
  getNearbyFarmers,
  createUpdateFarmer,
  deleteFarmer,
  verifyFarmer
};