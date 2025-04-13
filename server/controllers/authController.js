const User = require('../models/User');
const passwordUtils = require('../utils/passwordUtils');
const jwt = require('jsonwebtoken');

// Register a new user
const register = async (req, res) => {
  try {
    const { email, username, firstName, lastName, password, role } = req.body;
    
    // Check if user already exists
    const duplicate = await User.findOne({ $or: [{ username }, { email }] }).exec();
    if (duplicate) {
      return res.status(409).json({ message: 'Username or email already exists' });
    }
    
    // Create roles object
    const roles = { Consumer: 2001 };
    
    if (role === 'farmer') {
      roles.Farmer = 3001;
    } else if (role === 'admin') {
      roles.Admin = 9001;
    } else if (role === 'superadmin') {
      roles.Admin = 9001;
      roles.SuperAdmin = 9999;
    }
    
    // Hash password
    const { hash, salt } = passwordUtils.hashPassword(password);
    
    // Create and store new user
    const result = await User.create({
      username,
      email,
      firstName,
      lastName,
      password: hash,
      salt,
      roles
    });
    
    res.status(201).json({ 
      success: true,
      message: `New user ${username} created!`,
      userId: result._id
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// User login
const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Find user
    const foundUser = await User.findOne({ username }).exec();
    if (!foundUser) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Verify password
    const match = passwordUtils.comparePassword(password, foundUser.password, foundUser.salt);
    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Create JWT payload
    const userInfo = {
      id: foundUser._id,
      email: foundUser.email,
      username: foundUser.username,
      firstName: foundUser.firstName,
      lastName: foundUser.lastName,
      phone: foundUser.phone,
      location: foundUser.location,
      description: foundUser.description,
      roles: foundUser.roles
    };
    
    // Create tokens
    const accessToken = jwt.sign(
      { UserInfo: userInfo },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '1h' }
    );
    
    const refreshToken = jwt.sign(
      { username: foundUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '1d' }
    );
    
    // Save refresh token with current user
    foundUser.refreshToken = refreshToken;
    await foundUser.save();
    
    // Create secure cookie with refresh token
    res.cookie('jwt', refreshToken, {
      httpOnly: true, // accessible only by web server
      secure: process.env.NODE_ENV === 'production', // https only in production
      sameSite: 'None', // cross-site cookie
      maxAge: 24 * 60 * 60 * 1000 // cookie expiry: 1 day
    });
    
    // Send access token to user
    res.json({ accessToken, roles: foundUser.roles });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Refresh access token
const refresh = async (req, res) => {
  const cookies = req.cookies;
  
  if (!cookies?.jwt) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  
  const refreshToken = cookies.jwt;
  
  try {
    // Find user with this refresh token
    const foundUser = await User.findOne({ refreshToken }).exec();
    if (!foundUser) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    
    // Verify refresh token
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err || foundUser.username !== decoded.username) {
          return res.status(403).json({ message: 'Forbidden' });
        }
        
        // Create new access token
        const userInfo = {
          id: foundUser._id,
          email: foundUser.email,
          username: foundUser.username,
          firstName: foundUser.firstName,
          lastName: foundUser.lastName,
          phone: foundUser.phone,
          location: foundUser.location,
          description: foundUser.description,
          roles: foundUser.roles
        };
        
        const accessToken = jwt.sign(
          { UserInfo: userInfo },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: '1h' }
        );
        
        res.json({ accessToken, roles: foundUser.roles });
      }
    );
  } catch (err) {
    console.error('Refresh token error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Logout
const logout = async (req, res) => {
  const cookies = req.cookies;
  
  if (!cookies?.jwt) {
    return res.status(204).json({ message: 'No content' });
  }
  
  const refreshToken = cookies.jwt;
  
  try {
    // Find user with this refresh token
    const foundUser = await User.findOne({ refreshToken }).exec();
    
    // Clear refresh token in db if user found
    if (foundUser) {
      foundUser.refreshToken = '';
      await foundUser.save();
    }
    
    // Clear cookie
    res.clearCookie('jwt', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'None'
    });
    
    res.status(204).json({ message: 'Logged out successfully' });
  } catch (err) {
    console.error('Logout error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ADMIN FUNCTIONS

// Get all users (admin only)
const getAllUsers = async (req, res) => {
  try {
    // Check if user has admin role
    if (!req.user.roles || (!req.user.roles.Admin && !req.user.roles.SuperAdmin)) {
      return res.status(403).json({ message: 'Not authorized for this action' });
    }
    
    const users = await User.find().select('-password -salt -refreshToken');
    res.json(users);
  } catch (err) {
    console.error('Get all users error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a user (admin only)
const deleteUser = async (req, res) => {
  try {
    // Check if user has admin role
    if (!req.user.roles || (!req.user.roles.Admin && !req.user.roles.SuperAdmin)) {
      return res.status(403).json({ message: 'Not authorized for this action' });
    }
    
    const userId = req.params.id;
    
    // Find and delete user
    const deletedUser = await User.findByIdAndDelete(userId);
    
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Delete user error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a user (admin only)
const updateUser = async (req, res) => {
  try {
    // Check if user has admin role
    if (!req.user.roles || (!req.user.roles.Admin && !req.user.roles.SuperAdmin)) {
      return res.status(403).json({ message: 'Not authorized for this action' });
    }
    
    const userId = req.params.id;
    const { firstName, lastName, phone, location, password } = req.body;
    
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
    
    // Update password if provided
    if (password) {
      const { hash, salt } = passwordUtils.hashPassword(password);
      user.password = hash;
      user.salt = salt;
    }
    
    await user.save();
    
    // Return updated user without sensitive fields
    const updatedUser = await User.findById(userId).select('-password -salt -refreshToken');
    
    res.json(updatedUser);
  } catch (err) {
    console.error('Update user error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a user's role (admin only)
const updateUserRole = async (req, res) => {
  try {
    // Check if user has admin role
    if (!req.user.roles || (!req.user.roles.Admin && !req.user.roles.SuperAdmin)) {
      return res.status(403).json({ message: 'Not authorized for this action' });
    }
    
    const userId = req.params.id;
    const { role } = req.body;
    
    // Find user
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Set basic role
    const roles = { Consumer: 2001 };
    
    // Add additional roles
    if (role === 'farmer') {
      roles.Farmer = 3001;
    } else if (role === 'admin') {
      roles.Admin = 9001;
    } else if (role === 'superadmin') {
      roles.Admin = 9001;
      roles.SuperAdmin = 9999;
    }
    
    user.roles = roles;
    await user.save();
    
    // Return updated user without sensitive fields
    const updatedUser = await User.findById(userId).select('-password -salt -refreshToken');
    
    res.json(updatedUser);
  } catch (err) {
    console.error('Update user role error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  register,
  login,
  refresh,
  logout,
  getAllUsers,
  deleteUser,
  updateUser,
  updateUserRole
};