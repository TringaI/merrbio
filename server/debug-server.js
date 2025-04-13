require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const PORT = 5000;

// Enable CORS for all origins
app.use(cors({
  origin: '*',
  credentials: true
}));

// Middleware to parse JSON
app.use(express.json());

// Basic route to test server connectivity
app.get('/', (req, res) => {
  res.json({ message: 'Debug server running' });
});

// Test login endpoint
app.post('/auth/login', (req, res) => {
  const { username, password } = req.body;
  
  console.log('Login attempt:', { username, password });
  
  // Simple validation
  if (username === 'testuser' && password === 'password123') {
    res.json({
      success: true,
      accessToken: 'test_token_123',
      roles: ['user']
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Debug server running on http://localhost:${PORT}`);
  console.log('Use Ctrl+C to stop');
});