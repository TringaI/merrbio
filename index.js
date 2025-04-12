require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const credentials = require('./middlewares/credentials');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Handle options credentials check - before CORS!
app.use(credentials);

// CORS configuration
app.use(cors({ 
  origin: (origin, callback) => {
    callback(null, true); // Allow all origins for development
  },
  credentials: true 
}));

// Middleware for cookies
app.use(cookieParser());

// Middleware to parse JSON
app.use(express.json());

// Routes
app.use('/auth', require('./routes/auth'));
app.use('/users', require('./routes/users'));
app.use('/farmers', require('./routes/farmers'));
app.use('/products', require('./routes/products'));
app.use('/categories', require('./routes/categories'));
app.use('/requests', require('./routes/requests'));
app.use('/search', require('./routes/search'));
app.use('/messages', require('./routes/messages'));
app.use('/translations', require('./routes/translations'));
app.use('/reviews', require('./routes/reviews'));

// Basic route
app.get('/', (req, res) => {
  res.send('MerrBio API Running');
});

// Start server after successfully connecting to MongoDB
mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

// Handle MongoDB connection errors
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});