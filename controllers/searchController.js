const Product = require('../models/Product');

// Search products by multiple criteria
const searchProducts = async (req, res) => {
  try {
    const {
      query,        // Text search
      category,     // Filter by category
      minPrice,     // Minimum price
      maxPrice,     // Maximum price
      lat, lng,     // User location
      distance,     // Max distance in km
      sort = 'date' // Sort parameter: date, price_asc, price_desc, distance
    } = req.query;
    
    let searchQuery = { active: true };
    
    // Text search
    if (query) {
      searchQuery.$text = { $search: query };
    }
    
    // Category filter
    if (category) {
      searchQuery.category = category;
    }
    
    // Price range
    if (minPrice || maxPrice) {
      searchQuery.price = {};
      if (minPrice) searchQuery.price.$gte = Number(minPrice);
      if (maxPrice) searchQuery.price.$lte = Number(maxPrice);
    }
    
    // Distance search
    let products;
    if (lat && lng && distance) {
      products = await Product.find({
        ...searchQuery,
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [parseFloat(lng), parseFloat(lat)]
            },
            $maxDistance: parseFloat(distance) * 1000 // Convert km to meters
          }
        }
      })
      .populate('category', ['name', 'nameAl'])
      .populate('farmerId', ['farmName']);
    } else {
      // Sort options
      let sortOption = {};
      switch (sort) {
        case 'date':
          sortOption = { createdAt: -1 };
          break;
        case 'price_asc':
          sortOption = { price: 1 };
          break;
        case 'price_desc':
          sortOption = { price: -1 };
          break;
        default:
          sortOption = { createdAt: -1 };
      }
      
      products = await Product.find(searchQuery)
        .sort(sortOption)
        .populate('category', ['name', 'nameAl'])
        .populate('farmerId', ['farmName']);
    }
    
    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get nearby products
const getNearbyProducts = async (req, res) => {
  try {
    const { lat, lng, distance = 10 } = req.query;
    
    if (!lat || !lng) {
      return res.status(400).json({ message: 'Location coordinates required' });
    }
    
    const products = await Product.find({
      active: true,
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: parseFloat(distance) * 1000 // Convert km to meters
        }
      }
    })
    .populate('category', ['name', 'nameAl'])
    .populate('farmerId', ['farmName']);
    
    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  searchProducts,
  getNearbyProducts
};