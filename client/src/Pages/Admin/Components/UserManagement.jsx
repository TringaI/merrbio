import React, { useState, useEffect } from 'react';
import api from '../../../api/axios';

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
    role: 'Consumer',
    phone: ''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/auth/users');
      console.log('Users:', response.data);
      setUsers(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users. Please try again.');
      setLoading(false);
    }
  };

  const handleAddUser = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      username: '',
      password: '',
      role: 'Consumer',
      phone: ''
    });
    setShowAddModal(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: user.username,
      password: '',
      role: user.roles?.Farmer ? 'Farmer' : 
            user.roles?.Admin ? 'Admin' :
            user.roles?.SuperAdmin ? 'SuperAdmin' : 'Consumer',
      phone: user.phone || ''
    });
    setShowEditModal(true);
  };

  const handleDeleteUser = (userId) => {
    setConfirmDelete(userId);
  };

  const confirmDeleteUser = async () => {
    try {
      await api.delete(`/auth/users/${confirmDelete}`);
      setUsers(users.filter(user => user._id !== confirmDelete));
      setConfirmDelete(null);
    } catch (err) {
      console.error('Error deleting user:', err);
      setError('Failed to delete user. Please try again.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmitAdd = async (e) => {
    e.preventDefault();
    try {
      // Prepare data
      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        username: formData.username,
        password: formData.password,
        phone: formData.phone,
        role: formData.role.toLowerCase()
      };
      
      const response = await api.post('/auth/register', userData);
      console.log('User added:', response.data);
      
      // Refresh user list
      fetchUsers();
      
      // Close modal
      setShowAddModal(false);
    } catch (err) {
      console.error('Error adding user:', err);
      setError('Failed to add user. Please check your inputs and try again.');
    }
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    try {
      // Prepare update data
      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone
      };
      
      // Only include password if provided
      if (formData.password) {
        userData.password = formData.password;
      }
      
      // Update user
      await api.put(`/auth/users/${selectedUser._id}`, userData);
      
      // If role changed, update roles
      if (formData.role !== (selectedUser.roles?.Farmer ? 'Farmer' : 
                            selectedUser.roles?.Admin ? 'Admin' :
                            selectedUser.roles?.SuperAdmin ? 'SuperAdmin' : 'Consumer')) {
        // This would require a separate endpoint to update roles
        await api.put(`/auth/users/${selectedUser._id}/role`, { role: formData.role.toLowerCase() });
      }
      
      // Refresh user list
      fetchUsers();
      
      // Close modal
      setShowEditModal(false);
    } catch (err) {
      console.error('Error updating user:', err);
      setError('Failed to update user. Please try again.');
    }
  };

  // Filter users based on search term
  const filteredUsers = users.filter(user => {
    const searchString = searchTerm.toLowerCase();
    return (
      user.firstName?.toLowerCase().includes(searchString) ||
      user.lastName?.toLowerCase().includes(searchString) ||
      user.email?.toLowerCase().includes(searchString) ||
      user.username?.toLowerCase().includes(searchString)
    );
  });

  // Get role display name
  const getRoleName = (user) => {
    if (user.roles?.SuperAdmin) return 'SuperAdmin';
    if (user.roles?.Admin) return 'Admin';
    if (user.roles?.Farmer) return 'Farmer';
    return 'Consumer';
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
      
      {/* Search and Add User Row */}
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-1/3">
          <input
            type="text"
            placeholder="Search users..."
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
        
        <button
          className="bg-green-600 text-white py-2 px-4 rounded-md flex items-center"
          onClick={handleAddUser}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add User
        </button>
      </div>
      
      {/* Users Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-sm">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Username</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Role</th>
              <th className="py-3 px-4 text-left">Phone</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user._id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{user.firstName} {user.lastName}</td>
                  <td className="py-3 px-4">{user.username}</td>
                  <td className="py-3 px-4">{user.email}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      user.roles?.SuperAdmin ? 'bg-purple-100 text-purple-800' :
                      user.roles?.Admin ? 'bg-red-100 text-red-800' :
                      user.roles?.Farmer ? 'bg-green-100 text-green-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {getRoleName(user)}
                    </span>
                  </td>
                  <td className="py-3 px-4">{user.phone || '-'}</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      className="text-blue-600 hover:text-blue-900 mr-3"
                      onClick={() => handleEditUser(user)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-600 hover:text-red-900"
                      onClick={() => handleDeleteUser(user._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="py-4 text-center text-gray-500">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg w-[500px] max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add New User</h2>
              <button
                className="text-gray-500 hover:text-gray-800"
                onClick={() => setShowAddModal(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmitAdd}>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block mb-1">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full border rounded p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full border rounded p-2"
                    required
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border rounded p-2"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block mb-1">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full border rounded p-2"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block mb-1">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full border rounded p-2"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block mb-1">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full border rounded p-2"
                />
              </div>
              
              <div className="mb-4">
                <label className="block mb-1">Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full border rounded p-2"
                  required
                >
                  <option value="Consumer">Consumer</option>
                  <option value="Farmer">Farmer</option>
                  <option value="Admin">Admin</option>
                  <option value="SuperAdmin">SuperAdmin</option>
                </select>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-600 text-white py-2 px-4 rounded-md"
                >
                  Add User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg w-[500px] max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Edit User</h2>
              <button
                className="text-gray-500 hover:text-gray-800"
                onClick={() => setShowEditModal(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmitEdit}>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block mb-1">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full border rounded p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full border rounded p-2"
                    required
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border rounded p-2"
                  disabled
                />
                <p className="text-gray-500 text-sm mt-1">Email cannot be changed</p>
              </div>
              
              <div className="mb-4">
                <label className="block mb-1">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full border rounded p-2"
                  disabled
                />
                <p className="text-gray-500 text-sm mt-1">Username cannot be changed</p>
              </div>
              
              <div className="mb-4">
                <label className="block mb-1">New Password (leave blank to keep current)</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full border rounded p-2"
                />
              </div>
              
              <div className="mb-4">
                <label className="block mb-1">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full border rounded p-2"
                />
              </div>
              
              <div className="mb-4">
                <label className="block mb-1">Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full border rounded p-2"
                  required
                >
                  <option value="Consumer">Consumer</option>
                  <option value="Farmer">Farmer</option>
                  <option value="Admin">Admin</option>
                  <option value="SuperAdmin">SuperAdmin</option>
                </select>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white py-2 px-4 rounded-md"
                >
                  Update User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Confirm Delete Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg w-[400px]">
            <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
            <p className="mb-6">Are you sure you want to delete this user? This action cannot be undone.</p>
            
            <div className="flex justify-end">
              <button
                onClick={() => setConfirmDelete(null)}
                className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md mr-2"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteUser}
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

export default UserManagement;