import React, { useState, useEffect } from 'react';
import api from '../../../api/axios';

function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch products
      const productsResponse = await api.get('/products');
      setProducts(productsResponse.data);
      
      // Fetch categories
      const categoriesResponse = await api.get('/categories');
      setCategories(categoriesResponse.data);
      
      // Fetch farmers
      const farmersResponse = await api.get('/farmers');
      setFarmers(farmersResponse.data);
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load product data. Please try again.');
      setLoading(false);
    }
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setShowEditModal(true);
  };

  const handleDeleteProduct = (productId) => {
    setConfirmDelete(productId);
  };

  const confirmDeleteProduct = async () => {
    try {
      await api.delete(`/products/${confirmDelete}`);
      // Update the UI to reflect the deletion
      setProducts(products.filter(product => product._id !== confirmDelete));
      setConfirmDelete(null);
      setError(null); // Clear any previous errors
    } catch (err) {
      console.error('Error deleting product:', err);
      setError(err.response?.data?.message || 'Failed to delete product. Please try again.');
      // Keep the modal open to let the user try again
    }
  };

  // Filter products based on search term
  const filteredProducts = products.filter(product => {
    const searchString = searchTerm.toLowerCase();
    return (
      product.name?.toLowerCase().includes(searchString) ||
      product.description?.toLowerCase().includes(searchString) ||
      product.farmerId?.farmName?.toLowerCase().includes(searchString)
    );
  });

  // Get category name by ID
  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat._id === categoryId);
    return category ? category.nameAl || category.name : 'Unknown';
  };

  // Get farmer name by ID
  const getFarmerName = (farmerId) => {
    const farmer = farmers.find(f => f._id === farmerId);
    return farmer ? farmer.farmName : 'Unknown';
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
      
      {/* Search Row */}
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-1/3">
          <input
            type="text"
            placeholder="Search products..."
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
      </div>
      
      {/* Products Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-sm">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="py-3 px-4 text-left">Product</th>
              <th className="py-3 px-4 text-left">Category</th>
              <th className="py-3 px-4 text-left">Price</th>
              <th className="py-3 px-4 text-left">Quantity</th>
              <th className="py-3 px-4 text-left">Farmer</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <tr key={product._id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <img 
                        src={`/images/product-images/${product.images?.[0] || 'product-1.png'}`} 
                        alt={product.name} 
                        className="w-10 h-10 rounded object-cover mr-3"
                      />
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-xs text-gray-500 truncate w-48">{product.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">{getCategoryName(product.category)}</td>
                  <td className="py-3 px-4">${product.price} / {product.unit}</td>
                  <td className="py-3 px-4">{product.quantity} {product.unit}</td>
                  <td className="py-3 px-4">{typeof product.farmerId === 'object' ? product.farmerId.farmName : getFarmerName(product.farmerId)}</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      className="text-blue-600 hover:text-blue-900 mr-3"
                      onClick={() => handleEditProduct(product)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-600 hover:text-red-900"
                      onClick={() => handleDeleteProduct(product._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="py-4 text-center text-gray-500">
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Confirm Delete Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg w-[400px]">
            <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
            <p className="mb-6">Are you sure you want to delete this product? This action cannot be undone.</p>
            
            <div className="flex justify-end">
              <button
                onClick={() => setConfirmDelete(null)}
                className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md mr-2"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteProduct}
                className="bg-red-600 text-white py-2 px-4 rounded-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Edit Product Modal - Simplified version */}
      {showEditModal && selectedProduct && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg w-[500px] max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Edit Product</h2>
              <button
                className="text-gray-500 hover:text-gray-800"
                onClick={() => setShowEditModal(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <p className="mb-4 text-gray-600">
              Products are managed by farmers. For detailed editing, please visit the farmer's dashboard.
            </p>
            
            <div className="mb-4">
              <h3 className="font-medium">Product Details</h3>
              <p><span className="font-medium">Name:</span> {selectedProduct.name}</p>
              <p><span className="font-medium">Category:</span> {getCategoryName(selectedProduct.category)}</p>
              <p><span className="font-medium">Price:</span> ${selectedProduct.price} / {selectedProduct.unit}</p>
              <p><span className="font-medium">Quantity:</span> {selectedProduct.quantity} {selectedProduct.unit}</p>
              <p><span className="font-medium">Farmer:</span> {typeof selectedProduct.farmerId === 'object' ? selectedProduct.farmerId.farmName : getFarmerName(selectedProduct.farmerId)}</p>
            </div>
            
            <div className="mb-4">
              <h3 className="font-medium">Description</h3>
              <p className="text-gray-700">{selectedProduct.description}</p>
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={() => setShowEditModal(false)}
                className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductManagement;