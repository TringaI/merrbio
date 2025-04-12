const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const purchaseRequestSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    farmerId: {
        type: Schema.Types.ObjectId,
        ref: 'Farmer',
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected', 'completed', 'cancelled'],
        default: 'pending'
    },
    message: {
        type: String
    },
    deliveryAddress: {
        type: String,
        required: true
    },
    contactPhone: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('PurchaseRequest', purchaseRequestSchema);