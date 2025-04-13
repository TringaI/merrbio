import React from 'react';
import { useLanguage } from '../../../context/language/LanguageContext';

const ConversationList = ({ conversations, selectedConversation, onSelectConversation, loading }) => {
  const { t } = useLanguage();
  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        {t('no_conversations')}
      </div>
    );
  }

  return (
    <div className="overflow-y-auto h-[calc(100vh-160px)]">
      {conversations.map((conversation) => (
        <div 
          key={conversation._id}
          className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
            selectedConversation?._id === conversation._id ? 'bg-green-50' : ''
          }`}
          onClick={() => onSelectConversation(conversation)}
        >
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 mr-3">
              {conversation.otherUser?.profileImage ? (
                <img 
                  src={conversation.otherUser.profileImage} 
                  alt={`${conversation.otherUser.firstName} ${conversation.otherUser.lastName}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-green-500 text-white text-xl font-bold">
                  {conversation.otherUser?.firstName?.[0]}{conversation.otherUser?.lastName?.[0]}
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">
                  {conversation.otherUser?.firstName} {conversation.otherUser?.lastName}
                </h3>
                <span className="text-xs text-gray-500">
                  {new Date(conversation.updatedAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm text-gray-600 truncate">
                {conversation.lastMessage?.content || 'No messages yet'}
              </p>
            </div>
            {conversation.unreadCount > 0 && (
              <div className="ml-2 bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {conversation.unreadCount}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ConversationList;