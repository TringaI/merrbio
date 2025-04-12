const User = require('../models/User');
const passwordUtils = require('../utils/passwordUtils');
const jwt = require('jsonwebtoken');

// Handle user login
const handleLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Validate request
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }
    
    // Check if user exists
    const foundUser = await User.findOne({ username }).exec();
    if (!foundUser) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Check password using our custom password utility
    const match = passwordUtils.comparePassword(password, foundUser.password, foundUser.salt);
    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Get user roles
    const roles = Object.values(foundUser.roles).filter(Boolean);
    
    // Create access token
    const accessToken = jwt.sign(
      {
        UserInfo: {
          id: foundUser._id,
          email: foundUser.email,
          username: foundUser.username,
          firstName: foundUser.firstName,
          lastName: foundUser.lastName,
          profileImage: foundUser.profileImage,
          phone: foundUser.phone,
          location: foundUser.location,
          description: foundUser.description,
          roles: roles
        }
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '1h' }
    );
    
    // Create refresh token
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
      httpOnly: true, 
      secure: true, 
      sameSite: 'None', 
      maxAge: 24 * 60 * 60 * 1000 
    });
    
    // Send roles and access token to user
    res.json({ roles, accessToken });
    
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Handle refresh token
const handleRefreshToken = async (req, res) => {
  try {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);
    
    const refreshToken = cookies.jwt;
    
    // Find user with matching refresh token
    const foundUser = await User.findOne({ refreshToken }).exec();
    if (!foundUser) return res.sendStatus(403); // Forbidden
    
    // Verify refresh token
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err || foundUser.username !== decoded.username) {
          return res.sendStatus(403);
        }
        
        const roles = Object.values(foundUser.roles).filter(Boolean);
        
        // Create new access token
        const accessToken = jwt.sign(
          {
            UserInfo: {
              id: foundUser._id,
              email: foundUser.email,
              username: foundUser.username,
              firstName: foundUser.firstName,
              lastName: foundUser.lastName,
              profileImage: foundUser.profileImage,
              phone: foundUser.phone,
              location: foundUser.location,
              description: foundUser.description,
              roles: roles
            }
          },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: '1h' }
        );
        
        res.json({ roles, accessToken });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Handle logout
const handleLogout = async (req, res) => {
  try {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204); // No content
    
    const refreshToken = cookies.jwt;
    
    // Find user with matching refresh token
    const foundUser = await User.findOne({ refreshToken }).exec();
    
    // Clear refresh token in db if user exists
    if (foundUser) {
      foundUser.refreshToken = '';
      await foundUser.save();
    }
    
    // Clear cookie
    res.clearCookie('jwt', { httpOnly: true, secure: true, sameSite: 'None' });
    res.sendStatus(204);
  }
  catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Register a new user
const handleRegister = async (req, res) => {
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

module.exports = {
  handleLogin,
  handleRefreshToken,
  handleLogout,
  handleRegister
};