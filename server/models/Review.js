const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    farmerId: {
        type: Schema.Types.ObjectId,
        ref: 'Farmer',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String
    }
}, {
    timestamps: true
});

// Ensure a user can leave only one review per farmer
reviewSchema.index({ userId: 1, farmerId: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);