const mongoose = require('mongoose');
const Product = require('./models/Product');
const Category = require('./models/Category');
const Farmer = require('./models/Farmer');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.DATABASE_URL)
  .then(() => console.log('MongoDB connected...'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Sample product data
const sampleProducts = [
  {
    name: 'Domate Bio',
    description: 'Domate të freskëta bio të kultivuara pa pesticide. Të pasura me vitamina dhe minerale, perfekte për sallatat tuaja.',
    price: 2.5,
    unit: 'kg',
    quantity: 100,
    images: ['product-1.png']
  },
  {
    name: 'Patate Bio',
    description: 'Patate Bio të kultivuara në fermë organike. Të përsosura për gatim dhe të pasura me vlera ushqyese.',
    price: 1.8,
    unit: 'kg',
    quantity: 150,
    images: ['product-1.png']
  },
  {
    name: 'Speca Bio',
    description: 'Speca të freskët bio me ngjyra të ndryshme. Ideale për sallatat, gatimet në zgarë ose mbushje.',
    price: 3.2,
    unit: 'kg',
    quantity: 80,
    images: ['product-1.png']
  },
  {
    name: 'Qepë Bio',
    description: 'Qepë bio të kultivuara në ferma lokale. Përdoren në shumë receta tradicionale dhe janë të pasura me antioksidantë.',
    price: 1.5,
    unit: 'kg',
    quantity: 120,
    images: ['product-1.png']
  },
  {
    name: 'Karota Bio',
    description: 'Karota bio të ëmbla dhe të freskëta. Të pasura me beta-karoten dhe vitamina, perfekte për supa, sallatat ose si snack.',
    price: 2.0,
    unit: 'kg',
    quantity: 90,
    images: ['product-1.png']
  },
  {
    name: 'Lakra Bio',
    description: 'Lakra bio të kultivuara me kujdes. Të pasura me vitamina dhe minerale, ideale për supa, sallatat ose gatim tradicional.',
    price: 1.8,
    unit: 'kg',
    quantity: 75,
    images: ['product-1.png']
  },
  {
    name: 'Tranguj Bio',
    description: 'Tranguj bio të freskët dhe ujorë. Perfektë për sallatat, lëngje të freskëta ose ushqime të lehta.',
    price: 2.2,
    unit: 'kg',
    quantity: 110,
    images: ['product-1.png']
  },
  {
    name: 'Spinaq Bio',
    description: 'Spinaq bio i freskët dhe i gjelbër. I pasur me hekur dhe vitamina, ideal për supa, sallatat ose gatim tradicional.',
    price: 2.8,
    unit: 'kg',
    quantity: 65,
    images: ['product-1.png']
  }
];

// Seed products
const seedProducts = async () => {
  try {
    // Get a category ID - create one if none exists
    let category = await Category.findOne();
    if (!category) {
      category = await Category.create({
        name: 'Vegetables',
        nameAl: 'Perime',
        image: 'vegetables.jpg',
        active: true
      });
      console.log('Created category:', category.nameAl);
    }

    // Get a farmer ID - we need at least one farmer in the database
    let farmer = await Farmer.findOne();
    if (!farmer) {
      console.error('No farmers found in the database. Please create a farmer first.');
      process.exit(1);
    }

    // Delete existing products (optional - uncomment if you want to reset)
    // await Product.deleteMany({});
    // console.log('Deleted all existing products');

    // Create products
    for (const product of sampleProducts) {
      const newProduct = new Product({
        ...product,
        category: category._id,
        farmerId: farmer._id,
        location: {
          type: 'Point',
          coordinates: farmer.location.coordinates || [20.5937, 41.3457] // Default coordinates for Albania
        }
      });
      
      await newProduct.save();
    }

    console.log(`${sampleProducts.length} products added successfully!`);
    process.exit(0);
  } catch (err) {
    console.error('Error seeding products:', err);
    process.exit(1);
  }
};

// Run the seed function
seedProducts();