import React, { useState, useEffect } from 'react';
import api from '../../../api/axios';
import { useLanguage } from '../../../context/language/LanguageContext';

const NewMessageButton = () => {
  const { t } = useLanguage();
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (searchTerm.length < 2) {
      setSearchResults([]);
      return;
    }

    const searchUsers = async () => {
      setLoading(true);
      try {
        // Search for farmers first
        const farmersResponse = await api.get(`/farmers/search?query=${searchTerm}`);
        
        // Then search for regular users
        const usersResponse = await api.get(`/users/search?query=${searchTerm}`);
        
        // Combine and deduplicate results
        const farmers = farmersResponse.data.map(farmer => ({
          ...farmer,
          ...farmer.userId,
          isFarmer: true
        }));
        
        const users = usersResponse.data.filter(user => 
          !farmers.some(farmer => farmer._id === user._id)
        );
        
        setSearchResults([...farmers, ...users]);
        setLoading(false);
      } catch (err) {
        setError(t('error_message'));
        setLoading(false);
        console.error(err);
      }
    };

    const debounce = setTimeout(() => {
      searchUsers();
    }, 500);

    return () => clearTimeout(debounce);
  }, [searchTerm]);

  const handleSelectUser = (user) => {
    // Make sure we're using the correct user ID (either directly or from userId property)
    const finalUser = {
      ...user,
      _id: user._id || (user.userId ? user.userId._id : null)
    };
    setSelectedUser(finalUser);
    setSearchTerm('');
    setSearchResults([]);
  };

  const handleSendMessage = async () => {
    if (!selectedUser || !message.trim()) return;

    try {
      await api.post('/messages', {
        receiverId: selectedUser._id,
        content: message.trim()
      });

      // Reset and close modal
      setMessage('');
      setSelectedUser(null);
      setShowModal(false);
      
      // Add a small delay before reloading to ensure the message is saved
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (err) {
      setError(t('error_message'));
      console.error(err);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 focus:outline-none"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="p-4 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">{t('new_message')}</h3>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setSelectedUser(null);
                    setMessage('');
                    setSearchTerm('');
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-4">
              {selectedUser ? (
                <div className="flex items-center mb-4 p-2 bg-gray-100 rounded">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 mr-3">
                    {selectedUser.profileImage ? (
                      <img 
                        src={selectedUser.profileImage} 
                        alt={`${selectedUser.firstName} ${selectedUser.lastName}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-green-500 text-white text-lg font-bold">
                        {selectedUser.firstName?.[0]}{selectedUser.lastName?.[0]}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold">
                      {selectedUser.firstName} {selectedUser.lastName}
                      {selectedUser.isFarmer && <span className="ml-1 text-sm text-green-500">(Farmer)</span>}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="ml-auto text-gray-400 hover:text-gray-600"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <div className="mb-4">
                  <label htmlFor="search-user" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('to')}:
                  </label>
                  <input
                    id="search-user"
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={t('search_users')}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  
                  {loading && (
                    <div className="flex justify-center mt-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-500"></div>
                    </div>
                  )}
                  
                  {searchResults.length > 0 && (
                    <div className="mt-2 max-h-40 overflow-y-auto border rounded bg-white">
                      {searchResults.map((user) => (
                        <div
                          key={user._id}
                          className="p-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => handleSelectUser(user)}
                        >
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 mr-2">
                              {user.profileImage ? (
                                <img 
                                  src={user.profileImage} 
                                  alt={`${user.firstName} ${user.lastName}`}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-green-500 text-white text-sm font-bold">
                                  {user.firstName?.[0]}{user.lastName?.[0]}
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="font-semibold">
                                {user.firstName} {user.lastName}
                                {user.isFarmer && <span className="ml-1 text-xs text-green-500">(Farmer)</span>}
                              </p>
                              <p className="text-xs text-gray-500">{user.email}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {searchTerm.length >= 2 && searchResults.length === 0 && !loading && (
                    <p className="text-sm text-gray-500 mt-2">{t('no_users_found')}</p>
                  )}
                </div>
              )}

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('message')}:
                </label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={t('type_message')}
                  rows="4"
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                ></textarea>
              </div>

              {error && (
                <div className="mt-2 text-sm text-red-600">
                  {error}
                </div>
              )}
            </div>

            <div className="p-4 border-t flex justify-end">
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedUser(null);
                  setMessage('');
                  setSearchTerm('');
                }}
                className="px-4 py-2 border rounded mr-2 hover:bg-gray-100"
              >
                {t('cancel')}
                </button>
                <button
                onClick={handleSendMessage}
                disabled={!selectedUser || !message.trim()}
                className="px-4 py-2 bg-green-500 text-white rounded disabled:bg-gray-300"
                >
                {t('send')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NewMessageButton;