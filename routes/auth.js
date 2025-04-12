const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/login', authController.handleLogin);
router.get('/refresh', authController.handleRefreshToken);
router.post('/logout', authController.handleLogout);
router.post('/register', authController.handleRegister);

module.exports = router;