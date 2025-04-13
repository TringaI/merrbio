import React, { useState, useEffect } from 'react';
import api from '../../../../api/axios';

function AddProducts() {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    unit: 'kg',
    quantity: '',
    category: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // Fetch categories for the dropdown
    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories');
        setCategories(response.data);
        
        // Set default category if available
        if (response.data && response.data.length > 0) {
          setFormData(prev => ({
            ...prev,
            category: response.data[0]._id
          }));
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'price' || name === 'quantity' ? parseFloat(value) : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Prepare product data
      const productData = {
        name: formData.name,
        description: formData.description,
        price: formData.price,
        unit: formData.unit,
        quantity: formData.quantity,
        category: formData.category,
        images: ['product-1.png'] // Default image as requested
      };

      // Submit the product
      const response = await api.post('/products', productData);
      console.log('Product added:', response.data);
      
      // Show success message
      setSuccess('Produkti u shtua me sukses!');
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        price: '',
        unit: 'kg',
        quantity: '',
        category: categories.length > 0 ? categories[0]._id : ''
      });
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err) {
      console.error('Error adding product:', err);
      setError(err.response?.data?.message || 'Ndodhi një gabim duke shtuar produktin');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='w-full mt-5'>
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
          {success}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="flex flex-col">
        <div className="mb-4">
          <label className="block poppins mb-1">Emri i produktit</label>
          <input 
            className='form-inputs p-3 w-full' 
            type="text" 
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder='Emri i produktit...' 
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block poppins mb-1">Përshkrimi</label>
          <textarea 
            className='form-inputs p-3 w-full' 
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder='Pershkrimi i produktit...' 
            rows="4"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block poppins mb-1">Kategoria</label>
          <select
            className='form-inputs p-3 w-full'
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Zgjidhni kategori...</option>
            {categories.map(category => (
              <option key={category._id} value={category._id}>
                {category.nameAl || category.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="mb-4">
          <label className="block poppins mb-1">Çmimi ($)</label>
          <input 
            className='form-inputs p-3 w-full' 
            type="number" 
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder='Cmimi i produktit...'
            step="0.01"
            min="0.01"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block poppins mb-1">Njësia</label>
          <select
            className='form-inputs p-3 w-full'
            name="unit"
            value={formData.unit}
            onChange={handleChange}
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
            className='form-inputs p-3 w-full' 
            type="number" 
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            placeholder='Sasia e produktit...'
            step="0.1"
            min="0.1"
            required
          />
        </div>
        
        <button 
          type="submit"
          className="mt-5 text-white dark-green-bg px-4 py-2 w-fit rounded-md"
          disabled={loading}
        >
          {loading ? 'Duke shtuar...' : 'Shto Produktin'}
        </button>
      </form>
    </div>
  );
}

export default AddProducts;