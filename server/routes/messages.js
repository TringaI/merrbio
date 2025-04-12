const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const verifyToken = require('../middlewares/auth');

// @route   GET /messages/conversations
// @desc    Get conversations for current user
// @access  Private
router.get('/conversations', verifyToken, messageController.getConversations);

// @route   GET /messages/:conversationId
// @desc    Get messages for a conversation
// @access  Private
router.get('/:conversationId', verifyToken, messageController.getMessages);

// @route   POST /messages
// @desc    Send a message
// @access  Private
router.post('/', verifyToken, messageController.sendMessage);

module.exports = router;