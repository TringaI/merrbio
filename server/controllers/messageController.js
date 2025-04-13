const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const mongoose = require('mongoose');

// Get conversations for current user
const getConversations = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const conversations = await Conversation.find({
      participants: userId
    })
    .populate({
      path: 'participants',
      select: 'firstName lastName profileImage'
    })
    .populate({
      path: 'lastMessage',
      select: 'content createdAt sender'
    })
    .sort({ updatedAt: -1 });
    
    // Format conversations to show the other participant
    const formattedConversations = conversations.map(conversation => {
      const otherParticipant = conversation.participants.find(
        participant => participant._id.toString() !== userId
      );
      
      return {
        _id: conversation._id,
        otherUser: otherParticipant,
        lastMessage: conversation.lastMessage,
        unreadCount: conversation.unreadCount.get(userId) || 0,
        updatedAt: conversation.updatedAt
      };
    });
    
    res.json(formattedConversations);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get messages for a conversation
const getMessages = async (req, res) => {
  try {
    const conversationId = req.params.conversationId;
    const userId = req.user.id;
    
    // Validate if conversationId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(conversationId)) {
      return res.status(400).json({ message: 'Invalid conversation ID format' });
    }
    
    // Check if user belongs to this conversation
    const conversation = await Conversation.findById(conversationId);
    
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }
    
    if (!conversation.participants.includes(userId)) {
      return res.status(401).json({ message: 'Not authorized to access this conversation' });
    }
    
    // Get messages
    const messages = await Message.find({ conversationId })
      .sort({ createdAt: 1 });
    
    // Mark messages as read
    await Message.updateMany(
      {
        conversationId,
        receiver: userId,
        read: false
      },
      { read: true }
    );
    
    // Update unread count in conversation
    conversation.unreadCount.set(userId, 0);
    await conversation.save();
    
    res.json(messages);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Send a message
const sendMessage = async (req, res) => {
  try {
    const { receiverId, content } = req.body;
    const senderId = req.user.id;
    
    if (!receiverId || !content) {
      return res.status(400).json({ message: 'Receiver ID and content are required' });
    }
    
    if (receiverId === senderId) {
      return res.status(400).json({ message: 'Cannot send message to yourself' });
    }
    
    // Create or get conversation
    let conversation;
    
    // Create participant array for query
    const participantIds = [senderId, receiverId];
    
    // Check if conversation exists with both participants
    conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] }
    });
    
    if (!conversation) {
      // Create new conversation
      conversation = new Conversation({
        participants: participantIds,
        unreadCount: new Map([[receiverId, 1]])
      });
    } else {
      // Update unread count for receiver
      const currentCount = conversation.unreadCount.get(receiverId) || 0;
      conversation.unreadCount.set(receiverId, currentCount + 1);
    }
    
    // Create message
    const message = new Message({
      conversationId: conversation._id,
      sender: senderId,
      receiver: receiverId,
      content
    });
    
    await message.save();
    
    // Update conversation with the last message
    conversation.lastMessage = message._id;
    await conversation.save();
    
    res.status(201).json(message);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getConversations,
  getMessages,
  sendMessage
};