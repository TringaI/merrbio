import React, { useState, useEffect } from 'react';
import api from '../../../api/axios';

function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  
  const [updateForm, setUpdateForm] = useState({
    status: '',
    message: ''
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      
      // In a real admin system, you'd have an endpoint to get ALL orders
      // For now, we'll fetch all purchase requests
      const ordersResponse = await api.get('/requests/all');
      
      // If that fails, we can try the farmer endpoint as fallback
      if (!ordersResponse.data || ordersResponse.data.length === 0) {
        try {
          const farmerOrdersResponse = await api.get('/requests/farmer');
          setOrders(farmerOrdersResponse.data);
          setLoading(false);
          return;
        } catch (farmerErr) {
          console.error('Error fetching farmer orders:', farmerErr);
        }
      }
      // Populate product and user info if not already populated
      const populatedOrders = await Promise.all(ordersResponse.data.map(async (order) => {
        let enrichedOrder = { ...order };
        
        // If product ID is not populated
        if (order.productId && typeof order.productId === 'string') {
          try {
            const productResponse = await api.get(`/products/${order.productId}`);
            enrichedOrder.productId = productResponse.data;
          } catch (err) {
            console.error(`Error fetching product ${order.productId}:`, err);
          }
        }
        
        // If user ID is not populated
        if (order.userId && typeof order.userId === 'string') {
          try {
            const userResponse = await api.get(`/users/${order.userId}`);
            enrichedOrder.userId = userResponse.data;
          } catch (err) {
            console.error(`Error fetching user ${order.userId}:`, err);
          }
        }
        
        return enrichedOrder;
      }));
      
      setOrders(populatedOrders);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to load orders. Please try again.');
      setLoading(false);
    }
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowViewModal(true);
  };

  const handleUpdateStatus = (order) => {
    setSelectedOrder(order);
    setUpdateForm({
      status: order.status,
      message: order.message || ''
    });
    setShowUpdateModal(true);
  };

  const handleUpdateFormChange = (e) => {
    const { name, value } = e.target;
    setUpdateForm({
      ...updateForm,
      [name]: value
    });
  };

  const handleSubmitUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put(`/requests/${selectedOrder._id}`, updateForm);
      
      // Update order in list
      setOrders(orders.map(order => 
        order._id === selectedOrder._id ? { ...order, ...response.data } : order
      ));
      
      setShowUpdateModal(false);
    } catch (err) {
      console.error('Error updating order status:', err);
      setError('Failed to update order status. Please try again.');
    }
  };

  // Filter orders based on search term and status
  const filteredOrders = orders.filter(order => {
    const matchesSearch = searchTerm === '' || 
      (order.productId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       order.userId?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       order.userId?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       order.contactPhone?.includes(searchTerm));
       
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'pending':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Pending</span>;
      case 'accepted':
        return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Accepted</span>;
      case 'completed':
        return <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Completed</span>;
      case 'rejected':
        return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">Rejected</span>;
      case 'cancelled':
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">Cancelled</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">{status}</span>;
    }
  };

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
      
      {/* Search and Filter Row */}
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-1/3">
          <input
            type="text"
            placeholder="Search orders..."
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
        
        <div className="flex space-x-2">
          <button
            className={`px-3 py-1 rounded-md ${filterStatus === 'all' ? 'bg-gray-800 text-white' : 'bg-gray-200'}`}
            onClick={() => setFilterStatus('all')}
          >
            All
          </button>
          <button
            className={`px-3 py-1 rounded-md ${filterStatus === 'pending' ? 'bg-yellow-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setFilterStatus('pending')}
          >
            Pending
          </button>
          <button
            className={`px-3 py-1 rounded-md ${filterStatus === 'accepted' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setFilterStatus('accepted')}
          >
            Accepted
          </button>
          <button
            className={`px-3 py-1 rounded-md ${filterStatus === 'completed' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setFilterStatus('completed')}
          >
            Completed
          </button>
          <button
            className={`px-3 py-1 rounded-md ${filterStatus === 'rejected' ? 'bg-red-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setFilterStatus('rejected')}
          >
            Rejected
          </button>
          <button
            className={`px-3 py-1 rounded-md ${filterStatus === 'cancelled' ? 'bg-gray-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setFilterStatus('cancelled')}
          >
            Cancelled
          </button>
        </div>
      </div>
      
      {/* Orders Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-sm">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="py-3 px-4 text-left">Order ID</th>
              <th className="py-3 px-4 text-left">Product</th>
              <th className="py-3 px-4 text-left">Customer</th>
              <th className="py-3 px-4 text-left">Date</th>
              <th className="py-3 px-4 text-left">Amount</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <tr key={order._id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 font-mono text-sm">{order._id.substring(0, 8)}...</td>
                  <td className="py-3 px-4">
                    {typeof order.productId === 'object' ? order.productId.name : 'Unknown Product'}
                  </td>
                  <td className="py-3 px-4">
                    {typeof order.userId === 'object' 
                      ? `${order.userId.firstName} ${order.userId.lastName}`
                      : 'Unknown User'
                    }
                  </td>
                  <td className="py-3 px-4 text-sm">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="py-3 px-4">
                    ${order.totalPrice.toFixed(2)}
                  </td>
                  <td className="py-3 px-4">
                    {getStatusBadge(order.status)}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      className="text-blue-600 hover:text-blue-900 mr-2"
                      onClick={() => handleViewOrder(order)}
                    >
                      View
                    </button>
                    <button
                      className="text-green-600 hover:text-green-900"
                      onClick={() => handleUpdateStatus(order)}
                    >
                      Update
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="py-4 text-center text-gray-500">
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* View Order Modal */}
      {showViewModal && selectedOrder && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg w-[700px] max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Order Details</h2>
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
                <h3 className="font-medium text-lg mb-2">Order Information</h3>
                <p><span className="font-medium">Order ID:</span> {selectedOrder._id}</p>
                <p><span className="font-medium">Date:</span> {formatDate(selectedOrder.createdAt)}</p>
                <p><span className="font-medium">Status:</span> {getStatusBadge(selectedOrder.status)}</p>
                <p><span className="font-medium">Total Price:</span> ${selectedOrder.totalPrice.toFixed(2)}</p>
                <p><span className="font-medium">Quantity:</span> {selectedOrder.quantity} {selectedOrder.productId?.unit || ''}</p>
                
                {selectedOrder.message && (
                  <div className="mt-3">
                    <p className="font-medium">Message:</p>
                    <p className="bg-gray-50 p-2 rounded mt-1">{selectedOrder.message}</p>
                  </div>
                )}
              </div>
              
              <div>
                <h3 className="font-medium text-lg mb-2">Delivery Information</h3>
                <p><span className="font-medium">Address:</span> {selectedOrder.deliveryAddress}</p>
                <p><span className="font-medium">Contact Phone:</span> {selectedOrder.contactPhone}</p>
                
                <h3 className="font-medium text-lg mt-4 mb-2">Customer Information</h3>
                {typeof selectedOrder.userId === 'object' ? (
                  <>
                    <p><span className="font-medium">Name:</span> {selectedOrder.userId.firstName} {selectedOrder.userId.lastName}</p>
                    <p><span className="font-medium">Email:</span> {selectedOrder.userId.email}</p>
                    <p><span className="font-medium">Username:</span> {selectedOrder.userId.username}</p>
                  </>
                ) : (
                  <p>Customer information not available</p>
                )}
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="font-medium text-lg mb-2">Product Information</h3>
              {typeof selectedOrder.productId === 'object' ? (
                <div className="flex items-start">
                  <img 
                    src={`/images/product-images/${selectedOrder.productId.images?.[0] || 'product-1.png'}`} 
                    alt={selectedOrder.productId.name} 
                    className="w-20 h-20 object-cover rounded mr-4"
                  />
                  <div>
                    <p className="font-medium">{selectedOrder.productId.name}</p>
                    <p className="text-sm text-gray-600">{selectedOrder.productId.description?.substring(0, 100)}...</p>
                    <p className="text-sm mt-1">
                      Price: ${selectedOrder.productId.price} / {selectedOrder.productId.unit}
                    </p>
                  </div>
                </div>
              ) : (
                <p>Product information not available</p>
              )}
            </div>
            
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowViewModal(false)}
                className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md mr-2"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowViewModal(false);
                  handleUpdateStatus(selectedOrder);
                }}
                className="bg-blue-600 text-white py-2 px-4 rounded-md"
              >
                Update Status
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Update Order Status Modal */}
      {showUpdateModal && selectedOrder && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg w-[500px]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Update Order Status</h2>
              <button
                className="text-gray-500 hover:text-gray-800"
                onClick={() => setShowUpdateModal(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmitUpdate}>
              <div className="mb-4">
                <label className="block mb-1">Order Status</label>
                <select
                  name="status"
                  value={updateForm.status}
                  onChange={handleUpdateFormChange}
                  className="w-full border rounded p-2"
                  required
                >
                  <option value="pending">Pending</option>
                  <option value="accepted">Accepted</option>
                  <option value="completed">Completed</option>
                  <option value="rejected">Rejected</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block mb-1">Message (optional)</label>
                <textarea
                  name="message"
                  value={updateForm.message}
                  onChange={handleUpdateFormChange}
                  className="w-full border rounded p-2"
                  rows="3"
                  placeholder="Add a message explaining the status change..."
                />
              </div>
              
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowUpdateModal(false)}
                  className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white py-2 px-4 rounded-md"
                >
                  Update Status
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderManagement;