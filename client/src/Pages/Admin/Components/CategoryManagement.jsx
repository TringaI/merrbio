import React, { useState, useEffect } from 'react';
import api from '../../../api/axios';

function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    nameAl: '',
    image: ''
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await api.get('/categories');
      console.log('Categories:', response.data);
      setCategories(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Failed to load categories. Please try again.');
      setLoading(false);
    }
  };

  const handleAddCategory = () => {
    setFormData({
      name: '',
      nameAl: '',
      image: ''
    });
    setShowAddModal(true);
  };

  const handleEditCategory = (category) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      nameAl: category.nameAl,
      image: category.image || ''
    });
    setShowEditModal(true);
  };

  const handleDeleteCategory = (categoryId) => {
    setConfirmDelete(categoryId);
  };

  const confirmDeleteCategory = async () => {
    try {
      await api.delete(`/categories/${confirmDelete}`);
      setCategories(categories.filter(cat => cat._id !== confirmDelete));
      setConfirmDelete(null);
    } catch (err) {
      console.error('Error deleting category:', err);
      setError('Failed to delete category. Please try again.');
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
      const response = await api.post('/categories', formData);
      console.log('Category added:', response.data);
      
      // Add new category to list
      setCategories([...categories, response.data]);
      
      // Close modal
      setShowAddModal(false);
    } catch (err) {
      console.error('Error adding category:', err);
      setError('Failed to add category. Please try again.');
    }
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put(`/categories/${selectedCategory._id}`, formData);
      console.log('Category updated:', response.data);
      
      // Update category in list
      setCategories(categories.map(cat => cat._id === selectedCategory._id ? response.data : cat));
      
      // Close modal
      setShowEditModal(false);
    } catch (err) {
      console.error('Error updating category:', err);
      setError('Failed to update category. Please try again.');
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
      
      {/* Header and Add button */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Categories</h2>
        <button
          className="bg-green-600 text-white py-2 px-4 rounded-md flex items-center"
          onClick={handleAddCategory}
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
          Add Category
        </button>
      </div>
      
      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.length > 0 ? (
          categories.map((category) => (
            <div key={category._id} className="bg-white p-4 rounded-md shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-lg">{category.nameAl || category.name}</h3>
                <div className="flex">
                  <button
                    className="text-blue-600 hover:text-blue-900 mr-2"
                    onClick={() => handleEditCategory(category)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 0L11.828 15.1a2 2 0 01-.586.586L7 17l1.314-4.242a2 2 0 01.586-.586l9.9-9.9z" />
                    </svg>
                  </button>
                  <button
                    className="text-red-600 hover:text-red-900"
                    onClick={() => handleDeleteCategory(category._id)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <p className="text-gray-600 text-sm">{category.name}</p>
              
              {category.image && (
                <img 
                  src={category.image.startsWith('http') ? category.image : `/images/${category.image}`} 
                  alt={category.name} 
                  className="mt-2 w-full h-32 object-cover rounded"
                />
              )}
            </div>
          ))
        ) : (
          <div className="col-span-full bg-gray-100 p-6 rounded-md text-center">
            <p className="text-gray-500">No categories found</p>
          </div>
        )}
      </div>
      
      {/* Add Category Modal */}
      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg w-[500px]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add New Category</h2>
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
              <div className="mb-4">
                <label className="block mb-1">Name (English)</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border rounded p-2"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block mb-1">Name (Albanian)</label>
                <input
                  type="text"
                  name="nameAl"
                  value={formData.nameAl}
                  onChange={handleChange}
                  className="w-full border rounded p-2"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block mb-1">Image URL (optional)</label>
                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  className="w-full border rounded p-2"
                />
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
                  Add Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Edit Category Modal */}
      {showEditModal && selectedCategory && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg w-[500px]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Edit Category</h2>
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
              <div className="mb-4">
                <label className="block mb-1">Name (English)</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border rounded p-2"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block mb-1">Name (Albanian)</label>
                <input
                  type="text"
                  name="nameAl"
                  value={formData.nameAl}
                  onChange={handleChange}
                  className="w-full border rounded p-2"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block mb-1">Image URL (optional)</label>
                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  className="w-full border rounded p-2"
                />
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
                  Update Category
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
            <p className="mb-6">Are you sure you want to delete this category? This action cannot be undone.</p>
            
            <div className="flex justify-end">
              <button
                onClick={() => setConfirmDelete(null)}
                className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md mr-2"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteCategory}
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

export default CategoryManagement;