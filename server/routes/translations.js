const express = require('express');
const router = express.Router();
const translationController = require('../controllers/translationController');
const verifyToken = require('../middlewares/auth');

// @route   GET /translations/:lang
// @desc    Get all translations for a specific language
// @access  Public
router.get('/:lang', translationController.getAllTranslations);

// @route   GET /translations/:lang/:key
// @desc    Get translation for a specific key in a specific language
// @access  Public
router.get('/:lang/:key', translationController.getTranslation);

// @route   POST /translations
// @desc    Add or update translation (admin only)
// @access  Private/Admin
router.post('/', verifyToken, translationController.updateTranslation);

module.exports = router;