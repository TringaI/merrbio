import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import ConversationList from './components/ConversationList';
import ConversationView from './components/ConversationView';
import NewMessageButton from './components/NewMessageButton';

const Messages = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();

  // Fetch conversations on component mount
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        const response = await api.get('/messages/conversations');
        setConversations(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching conversations. Please try again later.');
        setLoading(false);
        console.error(err);
      }
    };

    fetchConversations();
  }, []);

  // Fetch messages when a conversation is selected
  useEffect(() => {
    if (selectedConversation) {
      const fetchMessages = async () => {
        try {
          const response = await api.get(`/messages/${selectedConversation._id}`);
          setMessages(response.data);
        } catch (err) {
          console.error('Error fetching messages:', err);
          if (err.response?.status === 404) {
            // If conversation not found, it might be new
            setMessages([]);
          } else {
            setError('Error fetching messages. Please try again later.');
          }
        }
      };

      fetchMessages();
    } else {
      setMessages([]);
    }
  }, [selectedConversation]);

  // Handle sending a new message
  const handleSendMessage = async (content) => {
    if (!selectedConversation || !content.trim()) return;

    try {
      // Get the correct ID based on whether it's a User or Farmer
      const receiverId = selectedConversation.otherUser._id;
      
      const response = await api.post('/messages', {
        receiverId: receiverId,
        content: content.trim()
      });

      // Add new message to the list
      setMessages([...messages, response.data]);

      // Update conversations with latest message
      const updatedConversations = conversations.map(conv => {
        if (conv._id === selectedConversation._id) {
          return {
            ...conv,
            lastMessage: {
              content: content.trim(),
              createdAt: new Date().toISOString()
            },
            unreadCount: 0
          };
        }
        return conv;
      });

      // Sort by most recent message
      updatedConversations.sort((a, b) => 
        new Date(b.lastMessage?.createdAt || 0) - new Date(a.lastMessage?.createdAt || 0)
      );

      setConversations(updatedConversations);
    } catch (err) {
      setError('Error sending message. Please try again.');
      console.error(err);
    }
  };

  // Select a conversation
  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
  };

  return (
    <div className="flex h-screen pt-20"> {/* Add pt-20 to account for the navigation bar */}
      <div className="w-1/3 border-r bg-white shadow-sm">
        <div className="p-4 flex justify-between items-center border-b">
          <h2 className="text-xl font-semibold">Messages</h2>
          <NewMessageButton />
        </div>
        <ConversationList 
          conversations={conversations} 
          selectedConversation={selectedConversation} 
          onSelectConversation={handleSelectConversation}
          loading={loading}
        />
      </div>
      <div className="w-2/3">
        {selectedConversation ? (
          <ConversationView 
            conversation={selectedConversation} 
            messages={messages} 
            onSendMessage={handleSendMessage}
          />
        ) : (
          <div className="h-full flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <h3 className="text-lg text-gray-500">Select a conversation or start a new one</h3>
            </div>
          </div>
        )}
      </div>
      {error && (
        <div className="absolute bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
          <button 
            className="ml-2 font-bold"
            onClick={() => setError(null)}
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
};

export default Messages;