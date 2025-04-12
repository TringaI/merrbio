const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    unit: {
        type: String,
        required: true,
        enum: ['kg', 'gram', 'piece', 'liter', 'box']
    },
    quantity: {
        type: Number,
        required: true
    },
    images: [{
        type: String
    }],
    farmerId: {
        type: Schema.Types.ObjectId,
        ref: 'Farmer',
        required: true
    },
    location: {
        type: {
            type: String,
            default: 'Point'
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: true
        }
    },
    active: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Create indexes for search and geospatial queries
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ "location.coordinates": "2dsphere" });

module.exports = mongoose.model('Product', productSchema);