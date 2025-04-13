import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import useAuth from '../../hooks/useAuth';

function ProductSpecific() {
  const location = useLocation();
  const navigate = useNavigate();
  const { auth } = useAuth();
  const [product, setProduct] = useState(null);
  const [farmer, setFarmer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showQuickAddModal, setShowQuickAddModal] = useState(false);
  const [purchaseFormData, setPurchaseFormData] = useState({
    quantity: 1,
    deliveryAddress: '',
    contactPhone: '',
    message: ''
  });
  const [purchaseError, setPurchaseError] = useState('');
  const [purchaseSuccess, setPurchaseSuccess] = useState('');
  
  // Quick add related states
  const [quickAddQuantity, setQuickAddQuantity] = useState(1);
  const [quickAddSuccess, setQuickAddSuccess] = useState('');
  const [quickAddError, setQuickAddError] = useState('');
  const [quickAddLoading, setQuickAddLoading] = useState(false);

  // Extract product ID from query params
  const searchParams = new URLSearchParams(location.search);
  const productId = searchParams.get('id');

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!productId) {
        setError('Produkti nuk u gjet');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await api.get(`/products/${productId}`);
        console.log('Product details:', response.data);
        setProduct(response.data);

        // Fetch farmer details if needed
        if (response.data.farmerId && typeof response.data.farmerId === 'string') {
          try {
            const farmerResponse = await api.get(`/farmers/${response.data.farmerId}`);
            setFarmer(farmerResponse.data);
          } catch (err) {
            console.error('Error fetching farmer details:', err);
          }
        } else {
          // If farmerId is already populated
          setFarmer(response.data.farmerId);
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching product details:', err);
        setError('Ndodhi një gabim duke marrë detajet e produktit');
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId]);

  const handlePurchaseModalOpen = async () => {
    if (!auth.isAuthenticated) {
      // Redirect to login if not authenticated
      navigate('/login?redirect=' + encodeURIComponent(location.pathname + location.search));
      return;
    }
    
    // Fetch user data to pre-fill address and phone
    try {
      const userResponse = await api.get('/users/me');
      console.log('User data for pre-fill:', userResponse.data);
      
      setPurchaseFormData({
        ...purchaseFormData,
        deliveryAddress: userResponse.data.location?.address || '',
        contactPhone: userResponse.data.phone || ''
      });
    } catch (err) {
      console.error('Error fetching user data:', err);
    }
    
    setShowPurchaseModal(true);
  };

  const handlePurchaseFormChange = (e) => {
    const { name, value } = e.target;
    setPurchaseFormData({
      ...purchaseFormData,
      [name]: name === 'quantity' ? parseFloat(value) || 0.5 : value
    });
  };

  const handlePurchaseSubmit = async (e) => {
    e.preventDefault();
    setPurchaseError('');
    setPurchaseSuccess('');

    if (!auth.isAuthenticated) {
      setPurchaseError('Ju lutem identifikohuni për të vazhduar');
      return;
    }

    if (purchaseFormData.quantity <= 0) {
      setPurchaseError('Sasia duhet të jetë më e madhe se 0');
      return;
    }
    
    if (purchaseFormData.quantity > product.quantity) {
      setPurchaseError(`Sasia maksimale në dispozicion është ${product.quantity} ${product.unit}`);
      return;
    }

    if (!purchaseFormData.deliveryAddress.trim()) {
      setPurchaseError('Adresa e dorëzimit është e detyrueshme');
      return;
    }

    if (!purchaseFormData.contactPhone.trim()) {
      setPurchaseError('Numri i kontaktit është i detyrueshëm');
      return;
    }

    try {
      // Calculate total price
      const totalPrice = product.price * purchaseFormData.quantity;

      const purchaseData = {
        productId: product._id,
        quantity: purchaseFormData.quantity,
        deliveryAddress: purchaseFormData.deliveryAddress,
        contactPhone: purchaseFormData.contactPhone,
        message: purchaseFormData.message,
        totalPrice // Optional: Can be calculated on the server too
      };

      console.log('Sending purchase request:', purchaseData);
      const response = await api.post('/requests', purchaseData);
      console.log('Purchase response:', response.data);

      setPurchaseSuccess('Kërkesa për blerje u dërgua me sukses!');
      
      // Close the modal after a delay
      setTimeout(() => {
        setShowPurchaseModal(false);
        // Reset form data
        setPurchaseFormData({
          quantity: 1,
          deliveryAddress: '',
          contactPhone: '',
          message: ''
        });
      }, 2000);

    } catch (err) {
      console.error('Error making purchase request:', err);
      setPurchaseError(
        err.response?.data?.message || 'Ndodhi një gabim gjatë dërgimit të kërkesës'
      );
    }
  };
  
  // Handle quick add to cart
  const handleQuickAdd = async () => {
    if (!auth.isAuthenticated) {
      // Redirect to login if not authenticated
      navigate('/login?redirect=' + encodeURIComponent(location.pathname + location.search));
      return;
    }

    setQuickAddError('');
    setQuickAddSuccess('');
    setQuickAddLoading(true);

    try {
      // Create a purchase request with minimal info
      const purchaseData = {
        productId: product._id,
        quantity: quickAddQuantity,
        deliveryAddress: 'Të plotësohet',
        contactPhone: 'Të plotësohet',
        message: '',
        totalPrice: product.price * quickAddQuantity
      };

      await api.post('/requests', purchaseData);
      setQuickAddSuccess('Produkti u shtua me sukses!');
      setQuickAddLoading(false);
      
      // Close the modal after a delay
      setTimeout(() => {
        setShowQuickAddModal(false);
        setQuickAddSuccess('');
      }, 2000);

    } catch (err) {
      console.error('Error adding product:', err);
      setQuickAddError(err.response?.data?.message || 'Ndodhi një gabim. Ju lutemi provoni përsëri.');
      setQuickAddLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full mt-40 flex justify-center items-center">
        <img src="/images/icons/loading.png" className="w-[50px] animate-spin" alt="Loading..." />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="w-full mt-40 flex justify-center items-center">
        <div className="bg-red-100 text-red-700 p-4 rounded-md">
          {error || 'Produkti nuk u gjet'}
        </div>
      </div>
    );
  }

  // Get farmer name - handle both populated and non-populated cases
  const farmerName = farmer 
    ? (farmer.farmName || (farmer.userId ? `${farmer.userId.firstName} ${farmer.userId.lastName}` : 'N/A'))
    : (product.farmerId && typeof product.farmerId === 'object' 
      ? product.farmerId.farmName 
      : 'N/A');

  return (
    <div className='w-full mt-40 flex items-center justify-center'>
      <div className='w-[80vw] grid gap-5 grid-cols-12'>
        <div className="col-span-6">
          <img 
            className='rounded-md' 
            src={product.images && product.images.length > 0 
              ? `/images/product-images/${product.images[0]}` 
              : "/images/product-images/product-1.png"} 
            alt={product.name} 
          />
        </div>
        <div className="col-span-6 flex flex-col border-l-[#478e69] border-l-2 pl-5">
          <h1 className='moret text-5xl'>{product.name}</h1>
          <p className='poppins text-gray-500 text-xl'>Fermer: {farmerName}</p>
          <p className='poppins text-gray-600 text-base mt-10'>
            {product.description}
          </p>
          <p className='poppins text-gray-600 text-base mt-5'>
            Cmimi: <span className='font-medium'>{product.price}$</span> / {product.unit}
          </p>
          <p className='poppins text-gray-600 text-base'>
            Sasia në dispozicion: <span className='font-medium'>{product.quantity} {product.unit}</span>
          </p>
          <a href='/360' className="underline-wavy-green poppins mt-5 text-xl font-medium">Shikoni produktin ne 360</a>
          
          <div className="flex space-x-4 mt-5">
            <button 
              className='light-green-bg text-xl poppins w-fit py-2 px-4 rounded-md'
              onClick={handlePurchaseModalOpen}
            >
              Beni kerkese per blerje
            </button>
            
            <button 
              className='dark-green-bg text-white text-xl poppins w-fit py-2 px-4 rounded-md'
              onClick={() => setShowQuickAddModal(true)}
            >
              Shto
            </button>
          </div>
        </div>
      </div>

      {/* Purchase Modal */}
      {showPurchaseModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg w-[500px] max-h-[90vh] overflow-y-auto">
            <h2 className="moret text-2xl mb-4">Kërkesë për blerje</h2>
            <h3 className="poppins text-xl mb-4">{product.name}</h3>
            
            {purchaseError && (
              <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
                {purchaseError}
              </div>
            )}
            
            {purchaseSuccess && (
              <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
                {purchaseSuccess}
              </div>
            )}
            
            <form onSubmit={handlePurchaseSubmit}>
              <div className="mb-4">
                <label className="block poppins mb-1">Sasia ({product.unit})</label>
                <input
                  type="number"
                  name="quantity"
                  min="0.1"
                  max={product.quantity}
                  step="0.1"
                  value={purchaseFormData.quantity}
                  onChange={handlePurchaseFormChange}
                  className="w-full border p-2 rounded"
                  required
                />
                <p className="text-sm text-gray-500">
                  Çmimi total: {(product.price * purchaseFormData.quantity).toFixed(2)}$
                </p>
                <p className="text-xs text-gray-500">
                  Sasia maksimale: {product.quantity} {product.unit}
                </p>
              </div>
              
              <div className="mb-4">
                <label className="block poppins mb-1">Adresa e dorëzimit</label>
                <input
                  type="text"
                  name="deliveryAddress"
                  value={purchaseFormData.deliveryAddress}
                  onChange={handlePurchaseFormChange}
                  className="w-full border p-2 rounded"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block poppins mb-1">Numri i kontaktit</label>
                <input
                  type="text"
                  name="contactPhone"
                  value={purchaseFormData.contactPhone}
                  onChange={handlePurchaseFormChange}
                  className="w-full border p-2 rounded"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block poppins mb-1">Mesazhi (opsional)</label>
                <textarea
                  name="message"
                  value={purchaseFormData.message}
                  onChange={handlePurchaseFormChange}
                  className="w-full border p-2 rounded"
                  rows="3"
                />
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowPurchaseModal(false)}
                  className="px-4 py-2 border rounded"
                  disabled={!!purchaseSuccess}
                >
                  Anulo
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 dark-green-bg text-white rounded"
                  disabled={!!purchaseSuccess}
                >
                  Dërgo Kërkesën
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Quick Add Modal */}
      {showQuickAddModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg w-[400px]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold poppins">Shto produktin</h2>
              <button 
                onClick={() => setShowQuickAddModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mb-4">
              <p className="poppins font-medium">{product.name}</p>
              <p className="text-sm text-gray-500">{product.price}$ / {product.unit}</p>
            </div>
            
            {quickAddError && (
              <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
                {quickAddError}
              </div>
            )}
            
            {quickAddSuccess && (
              <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
                {quickAddSuccess}
              </div>
            )}
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Sasia ({product.unit})</label>
              <input
                type="number"
                min="0.1"
                max={product.quantity}
                step="0.1"
                value={quickAddQuantity}
                onChange={(e) => setQuickAddQuantity(Math.max(0.1, parseFloat(e.target.value) || 0.1))}
                className="w-full border p-2 rounded"
                required
              />
              <p className="text-sm text-gray-500">
                Cmimi total: {(product.price * quickAddQuantity).toFixed(2)}$
              </p>
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={handleQuickAdd}
                disabled={quickAddLoading || !!quickAddSuccess}
                className="px-4 py-2 dark-green-bg text-white rounded flex items-center"
              >
                {quickAddLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Duke punuar...
                  </>
                ) : 'Shto produktin'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductSpecific;