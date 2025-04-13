const Product = require('../models/Product');
const Farmer = require('../models/Farmer');

// Get all products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({ active: true })
      .populate('category', ['name', 'nameAl'])
      .populate('farmerId', ['farmName']);
    
    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get product by ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', ['name', 'nameAl'])
      .populate('farmerId', ['farmName', 'location', 'phone', 'email']);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get products by category
const getProductsByCategory = async (req, res) => {
  try {
    const products = await Product.find({ 
      category: req.params.categoryId,
      active: true
    })
      .populate('category', ['name', 'nameAl'])
      .populate('farmerId', ['farmName']);
    
    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get products by farmer
const getProductsByFarmer = async (req, res) => {
  try {
    const products = await Product.find({ 
      farmerId: req.params.farmerId,
      active: true
    })
      .populate('category', ['name', 'nameAl'])
      .populate('farmerId', ['farmName']);
    
    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new product
const createProduct = async (req, res) => {
  try {
    const { 
      name, 
      description, 
      category, 
      price, 
      unit, 
      quantity, 
      images
    } = req.body;
    
    // Find the farmer associated with the current user
    const farmer = await Farmer.findOne({ userId: req.user.id });
    
    if (!farmer) {
      return res.status(404).json({ message: 'Farmer profile not found. Create a farmer profile first.' });
    }
    
    const newProduct = new Product({
      name,
      description,
      category,
      price,
      unit,
      quantity,
      images: images || [],
      farmerId: farmer._id,
      location: farmer.location
    });
    
    const product = await newProduct.save();
    
    res.status(201).json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a product
const updateProduct = async (req, res) => {
  try {
    const { 
      name, 
      description, 
      category, 
      price, 
      unit, 
      quantity, 
      images,
      active
    } = req.body;
    
    let product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Check if the user is the owner of the product
    const farmer = await Farmer.findById(product.farmerId);
    
    if (farmer.userId.toString() !== req.user.id && !req.user.roles.includes(9001)) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    // Build product object
    const productFields = {};
    if (name) productFields.name = name;
    if (description) productFields.description = description;
    if (category) productFields.category = category;
    if (price) productFields.price = price;
    if (unit) productFields.unit = unit;
    if (quantity) productFields.quantity = quantity;
    if (images) productFields.images = images;
    if (active !== undefined) productFields.active = active;
    
    // Update
    product = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: productFields },
      { new: true }
    );
    
    res.json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a product (soft delete by setting active to false)
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Find associated farmer
    let farmer = null;
    try {
      farmer = await Farmer.findById(product.farmerId);
    } catch (error) {
      console.log('Error finding farmer:', error);
      // Continue with deletion even if farmer is not found
    }
    
    // Check if the user is the owner of the product or an admin
    if (farmer && farmer.userId && 
        farmer.userId.toString() !== req.user.id && 
        !req.user.roles?.Admin) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    // Do hard delete for admin users, soft delete for others
    if (req.user.roles?.Admin) {
      // Hard delete
      await Product.findByIdAndDelete(req.params.id);
    } else {
      // Soft delete
      await Product.findByIdAndUpdate(req.params.id, { active: false });
    }
    
    res.json({ message: 'Product removed successfully' });
  } catch (err) {
    console.error('Error in deleteProduct:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  getProductsByCategory,
  getProductsByFarmer,
  createProduct,
  updateProduct,
  deleteProduct
};