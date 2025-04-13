import React, { useState } from 'react';
import './Components.scss';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import api from '../api/axios';

function ProductContainer(props) {
  const { auth } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Limit description to 100 characters
  const shortDescription = props.desc && props.desc.length > 100 
    ? props.desc.substring(0, 100) + '...' 
    : props.desc;
    
  const handleAddToCart = async () => {
    if (!auth.isAuthenticated) {
      setMessage({ type: 'error', text: 'Ju duhet të identifikoheni për të shtuar produktin.' });
      return;
    }
    
    try {
      setLoading(true);
      
      // Create a purchase request
      await api.post('/requests', {
        productId: props.id,
        quantity: quantity,
        // We'll prompt for more details in the checkout process
        deliveryAddress: 'Të plotësohet',
        contactPhone: 'Të plotësohet',
        message: '',
        totalPrice: props.price * quantity
      });
      
      setMessage({ type: 'success', text: 'Produkti u shtua me sukses!' });
      setLoading(false);
      
      // Close modal after a delay
      setTimeout(() => {
        setShowModal(false);
        setMessage({ type: '', text: '' });
      }, 2000);
      
    } catch (err) {
      console.error('Error adding product:', err);
      setMessage({ 
        type: 'error', 
        text: err.response?.data?.message || 'Ndodhi një gabim. Ju lutemi provoni përsëri.'
      });
      setLoading(false);
    }
  };

  return (
    <div className='w-full p-3 rounded-md product-containers bg-white'>
      <img 
        src={`/images/product-images/${props.image}`} 
        className='w-full object-cover h-[200px] rounded-md' 
        alt={props.product} 
      />
      
      <h1 className="poppins text-2xl font-medium mt-3">{props.product}</h1>
      <h2 className="poppins text-base mt-1 text-gray-500">{props.farmer}</h2>
      <p className="text-sm mt-3 poppins font-light text-gray-500">
        {shortDescription}
      </p>
      <p className="text-sm mt-3 poppins font-medium">
        {props.price}$
      </p>
      <hr className="my-3" />
      <div className="flex justify-between items-center">
        {/* <Link 
          to={`/produktet`} 
          className="light-green-bg px-3 py-2 rounded-md poppins inline-block"
        >
          Shiko Produktin
        </Link> */}

      </div>
      
      {/* Quick Add Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg w-[400px]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold poppins">Shto produktin</h2>
              <button 
                onClick={() => {
                  setShowModal(false);
                  setMessage({ type: '', text: '' });
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mb-4">
              <p className="poppins font-medium">{props.product}</p>
              <p className="text-sm text-gray-500">{props.price}$ / njësi</p>
            </div>
            
            {message.text && (
              <div className={`p-3 rounded mb-4 ${message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                {message.text}
              </div>
            )}
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Sasia</label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full border rounded-md p-2"
              />
            </div>
            
            <div className="text-right">
              <button
                onClick={handleAddToCart}
                disabled={loading}
                className="dark-green-bg text-white px-4 py-2 rounded-md poppins inline-flex items-center"
              >
                
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default ProductContainer;