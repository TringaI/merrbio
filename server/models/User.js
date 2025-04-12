const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    roles: {
        Consumer: {
            type: Number,
            default: 2001,
        },
        Farmer: Number,
        Admin: Number,
    },
    profileImage: {
        type: String
    },
    phone: {
        type: String,
    },
    location: {
        type: {
            type: String,
            default: 'Point'
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            default: [0, 0]
        }
    },
    description: {
        type: String,
        default: ''
    },
    notifications: {
        type: Array
    },
    password: {
        type: String,
        required: true
    },
    salt: {
        type: String,
        required: true
    },
    refreshToken: String
});

module.exports = mongoose.model('User', userSchema);