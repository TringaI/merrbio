import React, { useState, useEffect } from 'react';
import api from '../../../../api/axios';

function Approval() {
  const [purchaseRequests, setPurchaseRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  
  useEffect(() => {
    fetchPurchaseRequests();
  }, []);

  const fetchPurchaseRequests = async () => {
    try {
      setLoading(true);
      const response = await api.get('/requests/farmer');
      console.log('Purchase requests:', response.data);
      
      // Filter to get only pending requests
      const pendingRequests = response.data.filter(req => req.status === 'pending');
      setPurchaseRequests(pendingRequests);
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching purchase requests:', err);
      setError('Ndodhi një gabim duke marrë kërkesat për blerje');
      setLoading(false);
    }
  };

  const handleApprove = async (requestId) => {
    try {
      await api.put(`/requests/${requestId}`, { status: 'accepted' });
      
      // Remove the approved request from the list
      setPurchaseRequests(prevRequests => 
        prevRequests.filter(req => req._id !== requestId)
      );
    } catch (err) {
      console.error('Error approving request:', err);
      alert('Ndodhi një gabim duke aprovuar kërkesën');
    }
  };

  const handleRejectClick = (request) => {
    setSelectedRequest(request);
    setShowRejectModal(true);
  };

  const handleRejectConfirm = async () => {
    try {
      await api.put(`/requests/${selectedRequest._id}`, { 
        status: 'rejected',
        message: rejectReason || 'Kërkesa u refuzua'
      });
      
      // Remove the rejected request from the list
      setPurchaseRequests(prevRequests => 
        prevRequests.filter(req => req._id !== selectedRequest._id)
      );
      
      // Close modal
      setShowRejectModal(false);
      setSelectedRequest(null);
      setRejectReason('');
    } catch (err) {
      console.error('Error rejecting request:', err);
      alert('Ndodhi një gabim duke refuzuar kërkesën');
    }
  };

  if (loading) {
    return (
      <div className="w-full flex justify-center items-center p-10">
        <img src="/images/icons/loading.png" className="w-[50px] animate-spin" alt="Loading..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-5 bg-red-100 text-red-700 rounded-md">
        {error}
      </div>
    );
  }

  if (purchaseRequests.length === 0) {
    return (
      <div className="w-full p-5 bg-gray-100 rounded-md text-center">
        <p className="poppins">Nuk keni kërkesa në pritje.</p>
      </div>
    );
  }

  return (
    <div className='w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
      {purchaseRequests.map(request => (
        <div key={request._id} className='w-full p-4 rounded-md product-containers bg-white'>
          <div className="flex items-center">
            <img 
              src={request.productId.images && request.productId.images.length > 0 
                ? `/images/product-images/${request.productId.images[0]}` 
                : '/images/product-images/product-1.png'} 
              className='w-[100px] h-[100px] object-cover rounded-md' 
              alt={request.productId.name} 
            />
            
            <div className="ml-4">
              <h1 className="poppins text-xl font-medium">{request.productId.name}</h1>
              <p className="poppins text-sm text-gray-600">
                Blerësi: {request.userId.firstName} {request.userId.lastName}
              </p>
              <p className="poppins text-sm text-gray-600">
                Sasia: {request.quantity} {request.productId.unit}
              </p>
              <p className="poppins text-sm text-gray-600">
                Çmimi total: {request.totalPrice}$
              </p>
            </div>
          </div>
          
          <hr className="my-3" />
          
          <div className="mb-3">
            <p className="poppins text-sm font-medium">Adresa e dorëzimit:</p>
            <p className="poppins text-sm text-gray-600">{request.deliveryAddress}</p>
          </div>
          
          <div className="mb-3">
            <p className="poppins text-sm font-medium">Kontakt:</p>
            <p className="poppins text-sm text-gray-600">{request.contactPhone}</p>
          </div>
          
          {request.message && (
            <div className="mb-3">
              <p className="poppins text-sm font-medium">Mesazhi:</p>
              <p className="poppins text-sm text-gray-600 italic">{request.message}</p>
            </div>
          )}
          
          <div className="flex mt-4 justify-between">
            <button 
              className="bg-red-600 text-white px-3 py-1 rounded-md text-sm"
              onClick={() => handleRejectClick(request)}
            >
              Refuzo
            </button>
            <button 
              className="light-green-bg px-3 py-1 rounded-md text-sm ml-2"
              onClick={() => handleApprove(request._id)}
            >
              Aprovo
            </button>
          </div>
        </div>
      ))}
      
      {/* Reject Modal */}
      {showRejectModal && selectedRequest && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg w-[400px]">
            <h2 className="moret text-2xl mb-4">Refuzo kërkesën</h2>
            
            <div className="mb-4">
              <label className="block poppins mb-1">Arsyeja (opsionale)</label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full border p-2 rounded"
                rows="3"
                placeholder="Shkruani arsyen e refuzimit..."
              />
            </div>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 border rounded"
              >
                Anulo
              </button>
              <button
                onClick={handleRejectConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Refuzo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Approval;