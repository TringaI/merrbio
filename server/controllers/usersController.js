const User = require('../models/User');
const passwordUtils = require('../utils/passwordUtils');

// Register a new user
const registerUser = async (req, res) => {
  try {
    const { email, username, firstName, lastName, password, phone, location, role } = req.body;
    
    // Check for duplicate username or email
    const duplicateUsername = await User.findOne({ username }).exec();
    const duplicateEmail = await User.findOne({ email }).exec();
    
    if (duplicateUsername || duplicateEmail) {
      return res.status(409).json({ 
        message: duplicateUsername ? 'Username already taken' : 'Email already registered' 
      });
    }
    
    // Create roles object based on specified role
    const roles = { Consumer: 2001 }; // Default role
    
    if (role === 'farmer') {
      roles.Farmer = 3001;
    } else if (role === 'admin') {
      roles.Admin = 9001;
    }
    
    // Hash password using our custom password utility
    const passwordData = passwordUtils.hashPassword(password);
    
    // Create new user
    const newUser = new User({
      email,
      username,
      firstName,
      lastName,
      password: passwordData.hash,
      salt: passwordData.salt,
      phone,
      location,
      roles
    });
    
    await newUser.save();
    
    res.status(201).json({ 
      success: true,
      message: `New user ${username} created!`,
      userId: newUser._id
    });
    
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get current user profile
const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const user = await User.findById(userId).select('-password -salt -refreshToken');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { firstName, lastName, phone, location, description, profileImage, password } = req.body;
    
    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update fields
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (phone) user.phone = phone;
    if (location) user.location = location;
    if (description) user.description = description;
    if (profileImage) user.profileImage = profileImage;
    
    // Update password if provided
    if (password) {
      const passwordData = passwordUtils.hashPassword(password);
      user.password = passwordData.hash;
      user.salt = passwordData.salt;
    }
    
    await user.save();
    
    // Don't return sensitive information
    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.salt;
    delete userResponse.refreshToken;
    
    res.json({ message: 'Profile updated successfully', user: userResponse });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Search users by name or email
const searchUsers = async (req, res) => {
  try {
    const query = req.query.query;
    if (!query || query.length < 2) {
      return res.status(400).json({ message: 'Search query must be at least 2 characters' });
    }

    const users = await User.find({
      $or: [
        { firstName: { $regex: query, $options: 'i' } },
        { lastName: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
        { username: { $regex: query, $options: 'i' } }
      ]
    }).select('_id firstName lastName email profileImage');

    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  registerUser,
  getUserProfile,
  updateUserProfile,
  searchUsers
};