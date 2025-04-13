import React, { useState, useRef, useEffect } from 'react';

const ConversationView = ({ conversation, messages, onSendMessage }) => {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);
  // Get current user from auth token or localStorage
  const accessToken = localStorage.getItem('accessToken');
  let currentUser = {};
  
  try {
    if (accessToken) {
      const decoded = JSON.parse(atob(accessToken.split('.')[1]));
      currentUser = decoded.UserInfo || {};
    }
  } catch (error) {
    console.error('Error parsing JWT token:', error);
  }

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage('');
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Conversation Header */}
      <div className="p-4 border-b flex items-center">
        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 mr-3">
          {conversation.otherUser?.profileImage ? (
            <img 
              src={conversation.otherUser.profileImage} 
              alt={`${conversation.otherUser.firstName} ${conversation.otherUser.lastName}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-green-500 text-white text-lg font-bold">
              {conversation.otherUser?.firstName?.[0]}{conversation.otherUser?.lastName?.[0]}
            </div>
          )}
        </div>
        <div>
          <h3 className="font-semibold">
            {conversation.otherUser?.firstName} {conversation.otherUser?.lastName}
          </h3>
        </div>
      </div>

      {/* Messages List */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 my-4">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((message) => {
            const isOwnMessage = message.sender === currentUser.id || currentUser.id === message.sender;
            
            return (
              <div 
                key={message._id}
                className={`mb-4 flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[75%] p-3 rounded-lg ${
                    isOwnMessage 
                      ? 'bg-green-500 text-white rounded-tr-none' 
                      : 'bg-white border rounded-tl-none'
                  }`}
                >
                  <p>{message.content}</p>
                  <div 
                    className={`text-xs mt-1 ${isOwnMessage ? 'text-green-100' : 'text-gray-500'}`}
                  >
                    {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 border rounded-l-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="bg-green-500 text-white px-4 py-2 rounded-r-lg disabled:bg-gray-300 focus:outline-none"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default ConversationView;