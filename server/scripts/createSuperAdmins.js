/**
 * Script to create SuperAdmin users in the database
 * 
 * This script creates two superadmin users:
 * 1. Tringa Ibrahimi (superadmintringa)
 * 2. Zana Misini (superadminzana)
 */

const mongoose = require('mongoose');
const User = require('../models/User');
const passwordUtils = require('../utils/passwordUtils');
require('dotenv').config();

// Connect to MongoDB
async function connectToDatabase() {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
}

// Create SuperAdmin users
async function createSuperAdmins() {
  try {
    // Define superadmin users
    const superAdmins = [
      {
        email: 'tringaibrahimi@merrbio.com',
        username: 'superadmintringa',
        firstName: 'Tringa',
        lastName: 'Ibrahimi',
        password: '12345678',
        phone: '+38344123456',
        location: {
          type: 'Point',
          coordinates: [21.1655, 42.6629], // Pristina coordinates
          address: 'Prishtinë, Kosovo'
        },
        roles: {
          Consumer: 2001,
          Admin: 9001,
          SuperAdmin: 9999 // Custom role for super admins
        }
      },
      {
        email: 'zanamisini@merrbio.com',
        username: 'superadminzana',
        firstName: 'Zana',
        lastName: 'Misini',
        password: '12345678',
        phone: '+38344654321',
        location: {
          type: 'Point',
          coordinates: [21.1655, 42.6629], // Pristina coordinates
          address: 'Prishtinë, Kosovo'
        },
        roles: {
          Consumer: 2001,
          Admin: 9001,
          SuperAdmin: 9999 // Custom role for super admins
        }
      }
    ];

    // Create users one by one
    for (const adminData of superAdmins) {
      // Check if user already exists
      const existingUser = await User.findOne({ 
        $or: [
          { email: adminData.email },
          { username: adminData.username }
        ]
      });

      if (existingUser) {
        console.log(`User ${adminData.username} already exists, updating to superadmin...`);
        
        // Update existing user to have superadmin role
        const passwordData = passwordUtils.hashPassword(adminData.password);
        
        await User.findByIdAndUpdate(existingUser._id, {
          $set: {
            'roles.Admin': 9001,
            'roles.SuperAdmin': 9999,
            password: passwordData.hash,
            salt: passwordData.salt
          }
        });
        
        console.log(`Updated ${adminData.username} to SuperAdmin`);
      } else {
        // Hash password
        const passwordData = passwordUtils.hashPassword(adminData.password);
        
        // Create new user
        const newUser = new User({
          email: adminData.email,
          username: adminData.username,
          firstName: adminData.firstName,
          lastName: adminData.lastName,
          password: passwordData.hash,
          salt: passwordData.salt,
          phone: adminData.phone,
          location: adminData.location,
          roles: adminData.roles
        });
        
        await newUser.save();
        console.log(`Created SuperAdmin: ${adminData.username}`);
      }
    }

    console.log('SuperAdmin creation completed');
  } catch (err) {
    console.error('Error creating SuperAdmins:', err);
  } finally {
    // Disconnect from database
    mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the script
async function run() {
  await connectToDatabase();
  await createSuperAdmins();
  process.exit(0);
}

run();