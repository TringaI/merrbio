const Translation = require('../models/Translation');

// Get all translations for a specific language
const getAllTranslations = async (req, res) => {
  try {
    const { lang } = req.params;
    
    if (lang !== 'en' && lang !== 'al') {
      return res.status(400).json({ message: 'Invalid language code' });
    }
    
    const translations = await Translation.find();
    
    // Create a key-value map for the requested language
    const translationMap = {};
    translations.forEach(item => {
      translationMap[item.key] = item[lang];
    });
    
    res.json(translationMap);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a specific translation by key and language
const getTranslation = async (req, res) => {
  try {
    const { lang, key } = req.params;
    
    if (lang !== 'en' && lang !== 'al') {
      return res.status(400).json({ message: 'Invalid language code' });
    }
    
    const translation = await Translation.findOne({ key });
    
    if (!translation) {
      return res.status(404).json({ message: 'Translation not found' });
    }
    
    res.json({ key: translation.key, value: translation[lang] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add or update translation (admin only)
const updateTranslation = async (req, res) => {
  try {
    // Check if user is admin
    if (!req.user.roles.includes(9001)) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    const { key, en, al } = req.body;
    
    // Check if translation exists
    let translation = await Translation.findOne({ key });
    
    if (translation) {
      // Update existing translation
      translation = await Translation.findOneAndUpdate(
        { key },
        { $set: { en, al } },
        { new: true }
      );
    } else {
      // Create new translation
      translation = new Translation({
        key,
        en,
        al
      });
      
      await translation.save();
    }
    
    res.json(translation);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllTranslations,
  getTranslation,
  updateTranslation
};