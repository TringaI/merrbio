const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const translationSchema = new Schema({
  key: {
    type: String,
    required: true,
    unique: true
  },
  en: {
    type: String,
    required: true
  },
  al: {
    type: String,
    required: true
  }
});

// Create index for faster lookups
translationSchema.index({ key: 1 });

module.exports = mongoose.model('Translation', translationSchema);