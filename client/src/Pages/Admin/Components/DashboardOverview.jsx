import React, { useState, useEffect } from 'react';
import api from '../../../api/axios';

function DashboardOverview({ onTabChange }) {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalFarmers: 0,
    totalProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    recentUsers: [],
    recentProducts: []
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('stats');

  // State for the modals
  const [showUserModal, setShowUserModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  
  // Add new user function
  const handleAddUser = () => {
    setShowUserModal(true);
    onTabChange('users', 'User Management');
  };

  // Add new product function
  const handleAddProduct = () => {
    setShowProductModal(true);
    onTabChange('products', 'Product Management');
  };

  // Add new category function
  const handleAddCategory = () => {
    setShowCategoryModal(true);
    onTabChange('categories', 'Category Management');
  };

  // View pending orders function
  const handleViewPendingOrders = () => {
    onTabChange('orders', 'Order Management');
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Get all users
        const usersResponse = await api.get('/auth/users');
        const users = usersResponse.data || [];
        
        // Get all farmers
        const farmersResponse = await api.get('/farmers');
        const farmers = farmersResponse.data || [];
        
        // Get all products
        const productsResponse = await api.get('/products');
        const products = productsResponse.data || [];
        
        // Get all orders/requests
        const ordersResponse = await api.get('/requests/all');
        const orders = ordersResponse.data || [];
        
        // Calculate stats
        const pendingOrders = orders.filter(order => order.status === 'pending').length;
        
        // Sort users and products by date created (most recent first)
        const sortedUsers = [...users].sort((a, b) => 
          new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        );
        
        const sortedProducts = [...products].sort((a, b) => 
          new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        );
        
        // Update state with fetched data
        setStats({
          totalUsers: users.length,
          totalFarmers: farmers.length,
          totalProducts: products.length,
          totalOrders: orders.length,
          pendingOrders,
          recentUsers: sortedUsers.slice(0, 5), // Get 5 most recent users
          recentProducts: sortedProducts.slice(0, 5) // Get 5 most recent products
        });
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="w-full flex justify-center items-center p-10">
        <img src="/images/icons/loading.png" className="w-[50px] animate-spin" alt="Loading..." />
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <div className="dark-green-bg text-white p-4 rounded-md shadow-md">
          <h3 className="text-lg mb-1">Shuma e perdoruesve</h3>
          <p className="text-3xl font-bold">{stats.totalUsers}</p>
        </div>
        
        <div className="light-green-bg text-gray-800 p-4 rounded-md shadow-md">
          <h3 className="text-lg mb-1">Fermeret</h3>
          <p className="text-3xl font-bold">{stats.totalFarmers}</p>
        </div>
        
        <div className="blue-bg text-white p-4 rounded-md shadow-md">
          <h3 className="text-lg mb-1">Produktet</h3>
          <p className="text-3xl font-bold">{stats.totalProducts}</p>
        </div>
        
        <div className="light-green-bg text-gray-800 p-4 rounded-md shadow-md">
          <h3 className="text-lg mb-1">Porosite</h3>
          <p className="text-3xl font-bold">{stats.totalOrders}</p>
        </div>
        
        <div className="dark-green-bg text-white p-4 rounded-md shadow-md">
          <h3 className="text-lg mb-1">Porosite ne pritje</h3>
          <p className="text-3xl font-bold">{stats.pendingOrders}</p>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="bg-white p-5 rounded-md shadow-sm mb-8">
        <h3 className="text-xl poppins mb-4">Hapa te shpejte</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button 
            onClick={handleAddUser}
            className="dark-green-bg text-white py-2 px-4 rounded-md hover:opacity-90"
          >
           Shtoni perdorues te ri
          </button>
          <button 
            onClick={handleAddProduct}
            className="light-green-bg text-gray-700 py-2 px-4 rounded-md hover:opacity-90"
          >
            Shtoni produkt te ri
          </button>
          <button 
            onClick={handleAddCategory}
            className="blue-bg text-white py-2 px-4 rounded-md hover:opacity-90"
          >
            Shtoni nje kategori te re
          </button>
          <button 
            onClick={handleViewPendingOrders}
            className="light-green-bg text-gray-700 py-2 px-4 rounded-md hover:opacity-90"
          >
            Shiko porosite ne pritje
          </button>
        </div>
      </div>
      
      {/* Recent Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="bg-white p-5 rounded-md shadow-sm">
          <h3 className="text-xl poppins mb-4">Perdoruesit e fundit</h3>
          <div className="overflow-hidden">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-3 text-left">Emri</th>
                  <th className="py-2 px-3 text-left">Emri i perdoruesit</th>
                  <th className="py-2 px-3 text-left">Roli</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentUsers.length > 0 ? (
                  stats.recentUsers.map((user, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-2 px-3">{user.firstName} {user.lastName}</td>
                      <td className="py-2 px-3">{user.username}</td>
                      <td className="py-2 px-3">
                        {user.roles?.SuperAdmin ? 'SuperAdmin' : 
                         user.roles?.Admin ? 'Admin' : 
                         user.roles?.Farmer ? 'Farmer' : 'User'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="py-4 text-center text-gray-500">
                      Nuk ka perdorues
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Recent Products */}
        <div className="bg-white p-5 rounded-md shadow-sm">
          <h3 className="text-xl poppins mb-4">Produktet e fundit</h3>
          <div className="overflow-hidden">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-3 text-left">Produkti</th>
                  <th className="py-2 px-3 text-left">Cmimi</th>
                  <th className="py-2 px-3 text-left">Fermer</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentProducts.length > 0 ? (
                  stats.recentProducts.map((product, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-2 px-3">{product.name}</td>
                      <td className="py-2 px-3">${product.price} / {product.unit}</td>
                      <td className="py-2 px-3">{product.farmerId?.farmName || 'Unknown'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="py-4 text-center text-gray-500">
                      Nuk ka produkte
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardOverview;