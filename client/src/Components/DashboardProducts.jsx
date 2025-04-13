import React, { useState, useEffect } from 'react';
import './Components.scss';
import api from '../api/axios';

function DashboardProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  
  // Form state for editing
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    price: '',
    unit: 'kg',
    quantity: ''
  });

  useEffect(() => {
    fetchFarmerProducts();
  }, []);

  const fetchFarmerProducts = async () => {
    try {
      setLoading(true);
      
      // First get the current farmer's ID
      const farmerResponse = await api.get('/farmers');
      const currentUser = await api.get('/users/me');
      
      // Find the farmer that belongs to the current user
      const userFarmer = farmerResponse.data.find(
        farmer => farmer.userId._id === currentUser.data._id
      );
      
      if (!userFarmer) {
        setError('Nuk u gjet profili i fermerit');
        setLoading(false);
        return;
      }
      
      // Now get products for this farmer
      const productsResponse = await api.get(`/products/farmer/${userFarmer._id}`);
      console.log('Farmer products:', productsResponse.data);
      setProducts(productsResponse.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching farmer products:', err);
      setError('Ndodhi një gabim duke marrë produktet');
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setEditForm({
      name: product.name,
      description: product.description,
      price: product.price,
      unit: product.unit,
      quantity: product.quantity
    });
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm({
      ...editForm,
      [name]: name === 'price' || name === 'quantity' ? parseFloat(value) : value
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const updatedProduct = {
        name: editForm.name,
        description: editForm.description,
        price: editForm.price,
        unit: editForm.unit,
        quantity: editForm.quantity
      };
      
      await api.put(`/products/${editingProduct._id}`, updatedProduct);
      
      // Refresh product list
      fetchFarmerProducts();
      
      // Close edit modal
      setEditingProduct(null);
    } catch (err) {
      console.error('Error updating product:', err);
      alert('Ndodhi një gabim duke përditësuar produktin');
    }
  };

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await api.delete(`/products/${productToDelete._id}`);
      
      // Refresh product list
      fetchFarmerProducts();
      
      // Close delete modal
      setShowDeleteModal(false);
      setProductToDelete(null);
    } catch (err) {
      console.error('Error deleting product:', err);
      alert('Ndodhi një gabim duke fshirë produktin');
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

  if (products.length === 0) {
    return (
      <div className="w-full p-5 bg-gray-100 rounded-md text-center">
        <p className="poppins">Nuk keni shtuar produkte ende.</p>
      </div>
    );
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 w-full'>
      {products.map(product => (
        <div key={product._id} className='w-full p-3 rounded-md product-containers'>
          <img 
            src={product.images && product.images.length > 0 
              ? `/images/product-images/${product.images[0]}` 
              : '/images/product-images/product-1.png'} 
            className='w-full object-cover h-[200px] rounded-md' 
            alt={product.name} 
          />

          <h1 className="poppins text-2xl font-medium mt-3">{product.name}</h1>
          <p className="text-sm mt-3 poppins font-light text-gray-500">
            {product.description.length > 100 
              ? product.description.substring(0, 100) + '...' 
              : product.description}
          </p>
          <p className="text-sm mt-2 poppins">
            Çmimi: <span className="font-medium">{product.price}$</span> / {product.unit}
          </p>
          <p className="text-sm poppins">
            Sasia: <span className="font-medium">{product.quantity} {product.unit}</span>
          </p>
          <hr className="my-3" />
          <div className="flex justify-end w-full">
            <button 
              className="w-[30px]"
              onClick={() => handleEdit(product)}
            >
              <img src="/images/icons/edit.png" alt="Edit" />
            </button>
            <button 
              className="w-[30px] ml-3"
              onClick={() => handleDeleteClick(product)}
            >
              <img src="/images/icons/delete.png" alt="Delete" />
            </button>
          </div>
        </div>
      ))}

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg w-[500px] max-h-[90vh] overflow-y-auto">
            <h2 className="moret text-2xl mb-4">Përditëso Produktin</h2>
            
            <form onSubmit={handleEditSubmit}>
              <div className="mb-4">
                <label className="block poppins mb-1">Emri i produktit</label>
                <input
                  type="text"
                  name="name"
                  value={editForm.name}
                  onChange={handleEditFormChange}
                  className="w-full border p-2 rounded"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block poppins mb-1">Përshkrimi</label>
                <textarea
                  name="description"
                  value={editForm.description}
                  onChange={handleEditFormChange}
                  className="w-full border p-2 rounded"
                  rows="3"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block poppins mb-1">Çmimi ($)</label>
                <input
                  type="number"
                  name="price"
                  value={editForm.price}
                  onChange={handleEditFormChange}
                  step="0.01"
                  min="0.01"
                  className="w-full border p-2 rounded"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block poppins mb-1">Njësia</label>
                <select
                  name="unit"
                  value={editForm.unit}
                  onChange={handleEditFormChange}
                  className="w-full border p-2 rounded"
                  required
                >
                  <option value="kg">Kilogram (kg)</option>
                  <option value="gram">Gram (g)</option>
                  <option value="piece">Copë</option>
                  <option value="liter">Litër (L)</option>
                  <option value="box">Kuti</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block poppins mb-1">Sasia</label>
                <input
                  type="number"
                  name="quantity"
                  value={editForm.quantity}
                  onChange={handleEditFormChange}
                  min="0.1"
                  step="0.1"
                  className="w-full border p-2 rounded"
                  required
                />
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 border rounded"
                >
                  Anulo
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 dark-green-bg text-white rounded"
                >
                  Ruaj
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && productToDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg w-[400px]">
            <h2 className="moret text-2xl mb-4">Konfirmo fshirjen</h2>
            
            <p className="poppins mb-6">
              Jeni i sigurt që dëshironi të fshini produktin "{productToDelete.name}"?
            </p>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border rounded"
              >
                Anulo
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Fshi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardProducts;