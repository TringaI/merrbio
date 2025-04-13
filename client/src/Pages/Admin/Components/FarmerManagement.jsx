import React, { useState, useEffect } from 'react';
import api from '../../../api/axios';

function FarmerManagement() {
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [confirmVerify, setConfirmVerify] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  
  useEffect(() => {
    fetchFarmers();
  }, []);

  const fetchFarmers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/farmers');
      console.log('Farmers:', response.data);
      setFarmers(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching farmers:', err);
      setError('Failed to load farmers. Please try again.');
      setLoading(false);
    }
  };

  const handleViewFarmer = (farmer) => {
    setSelectedFarmer(farmer);
    setShowViewModal(true);
  };

  const handleVerifyFarmer = (farmerId) => {
    setConfirmVerify(farmerId);
  };

  const confirmVerifyFarmer = async () => {
    try {
      await api.put(`/farmers/${confirmVerify}/verify`);
      
      // Update farmer in list
      setFarmers(farmers.map(farmer => 
        farmer._id === confirmVerify ? { ...farmer, verified: true } : farmer
      ));
      
      setConfirmVerify(null);
    } catch (err) {
      console.error('Error verifying farmer:', err);
      setError(err.response?.data?.message || 'Failed to verify farmer. Please try again.');
    }
  };

  const handleDeleteFarmer = (farmerId) => {
    setConfirmDelete(farmerId);
  };

  const confirmDeleteFarmer = async () => {
    try {
      await api.delete(`/farmers/${confirmDelete}`);
      // Update the list by removing the deleted farmer
      setFarmers(farmers.filter(farmer => farmer._id !== confirmDelete));
      setConfirmDelete(null);
    } catch (err) {
      console.error('Error deleting farmer:', err);
      setError(err.response?.data?.message || 'Failed to delete farmer. Please try again.');
      setConfirmDelete(null);
    }
  };

  // Filter farmers based on search term
  const filteredFarmers = farmers.filter(farmer => {
    const searchString = searchTerm.toLowerCase();
    return (
      farmer.farmName?.toLowerCase().includes(searchString) ||
      farmer.description?.toLowerCase().includes(searchString) ||
      farmer.email?.toLowerCase().includes(searchString) ||
      farmer.phone?.toLowerCase().includes(searchString) ||
      farmer.userId?.firstName?.toLowerCase().includes(searchString) ||
      farmer.userId?.lastName?.toLowerCase().includes(searchString)
    );
  });

  if (loading) {
    return (
      <div className="w-full flex justify-center items-center p-10">
        <img src="/images/icons/loading.png" className="w-[50px] animate-spin" alt="Loading..." />
      </div>
    );
  }

  return (
    <div className="w-full">
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {/* Search Row */}
      <div className="relative w-1/3 mb-6">
        <input
          type="text"
          placeholder="Search farmers..."
          className="w-full border rounded-md p-2 pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 absolute left-2 top-2.5 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      
      {/* Farmers Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-sm">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="py-3 px-4 text-left">Farm Name</th>
              <th className="py-3 px-4 text-left">Owner</th>
              <th className="py-3 px-4 text-left">Contact</th>
              <th className="py-3 px-4 text-left">Location</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredFarmers.length > 0 ? (
              filteredFarmers.map((farmer) => (
                <tr key={farmer._id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="font-medium">{farmer.farmName}</div>
                    <div className="text-xs text-gray-500 truncate w-48">{farmer.description}</div>
                  </td>
                  <td className="py-3 px-4">
                    {farmer.userId?.firstName} {farmer.userId?.lastName}
                  </td>
                  <td className="py-3 px-4">
                    <div>{farmer.email}</div>
                    <div className="text-xs text-gray-500">{farmer.phone}</div>
                  </td>
                  <td className="py-3 px-4">
                    {farmer.location?.address || 'N/A'}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      farmer.verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {farmer.verified ? 'Verified' : 'Pending'}
                    </span>
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                      farmer.active ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {farmer.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      className="text-blue-600 hover:text-blue-900 mr-2"
                      onClick={() => handleViewFarmer(farmer)}
                    >
                      View
                    </button>
                    {!farmer.verified && (
                      <button
                        className="text-green-600 hover:text-green-900 mr-2"
                        onClick={() => handleVerifyFarmer(farmer._id)}
                      >
                        Verify
                      </button>
                    )}
                    <button
                      className="text-red-600 hover:text-red-900"
                      onClick={() => handleDeleteFarmer(farmer._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="py-4 text-center text-gray-500">
                  No farmers found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* View Farmer Modal */}
      {showViewModal && selectedFarmer && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg w-[700px] max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{selectedFarmer.farmName}</h2>
              <button
                className="text-gray-500 hover:text-gray-800"
                onClick={() => setShowViewModal(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-lg mb-2">Farm Information</h3>
                <p><span className="font-medium">Description:</span> {selectedFarmer.description}</p>
                <p><span className="font-medium">Status:</span> {selectedFarmer.active ? 'Active' : 'Inactive'}</p>
                <p><span className="font-medium">Verified:</span> {selectedFarmer.verified ? 'Yes' : 'No'}</p>
                
                <h3 className="font-medium text-lg mt-4 mb-2">Owner Information</h3>
                <p>
                  <span className="font-medium">Name:</span> {selectedFarmer.userId?.firstName} {selectedFarmer.userId?.lastName}
                </p>
                <p><span className="font-medium">Username:</span> {selectedFarmer.userId?.username}</p>
              </div>
              
              <div>
                <h3 className="font-medium text-lg mb-2">Contact Information</h3>
                <p><span className="font-medium">Email:</span> {selectedFarmer.email}</p>
                <p><span className="font-medium">Phone:</span> {selectedFarmer.phone}</p>
                
                <h3 className="font-medium text-lg mt-4 mb-2">Location Information</h3>
                <p><span className="font-medium">Address:</span> {selectedFarmer.location?.address}</p>
                <p>
                  <span className="font-medium">Coordinates:</span> {selectedFarmer.location?.coordinates?.join(', ')}
                </p>
              </div>
            </div>
            
            {selectedFarmer.farmerImages && selectedFarmer.farmerImages.length > 0 && (
              <div className="mt-4">
                <h3 className="font-medium text-lg mb-2">Farm Images</h3>
                <div className="grid grid-cols-3 gap-2">
                  {selectedFarmer.farmerImages.map((image, index) => (
                    <img 
                      key={index}
                      src={image.startsWith('http') ? image : `/images/farmers/${image}`} 
                      alt={`Farm ${index + 1}`} 
                      className="rounded-md w-full h-32 object-cover"
                    />
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowViewModal(false)}
                className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Confirm Verify Modal */}
      {confirmVerify && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg w-[400px]">
            <h2 className="text-xl font-bold mb-4">Confirm Verification</h2>
            <p className="mb-6">Are you sure you want to verify this farmer? This will allow them to sell products.</p>
            
            <div className="flex justify-end">
              <button
                onClick={() => setConfirmVerify(null)}
                className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md mr-2"
              >
                Cancel
              </button>
              <button
                onClick={confirmVerifyFarmer}
                className="bg-green-600 text-white py-2 px-4 rounded-md"
              >
                Verify Farmer
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Confirm Delete Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg w-[400px]">
            <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
            <p className="mb-6">Are you sure you want to delete this farmer? This action cannot be undone.</p>
            
            <div className="flex justify-end">
              <button
                onClick={() => setConfirmDelete(null)}
                className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md mr-2"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteFarmer}
                className="bg-red-600 text-white py-2 px-4 rounded-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FarmerManagement;