import React, { useState, useEffect } from 'react';
import ProductContainers from '../../Components/ProductContainer';
import api from '../../api/axios';

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch products from the API
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await api.get('/products');
        console.log('Products data:', response.data);
        setProducts(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Ndodhi një gabim duke marrë produktet.');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className='pt-20 w-full flex justify-center items-center min-h-[70vh]'>
        <img src="/images/icons/loading.png" className="w-[50px] animate-spin" alt="Loading..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className='pt-20 w-full flex justify-center items-center min-h-[70vh]'>
        <div className="bg-red-100 text-red-700 p-4 rounded-md">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className='pt-20 w-full flex justify-center items-center'>
      <div className='w-[80vw]'>
        <h1 className='moret text-3xl mb-6'>Produktet</h1>
        {products.length === 0 ? (
          <div className="w-full p-4 bg-gray-100 rounded-md text-center">
            <p className="poppins">Nuk u gjetën produkte.</p>
          </div>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
            {products.map(product => (
              <div key={product._id}>
                <ProductContainers 
                  id={product._id}
                  image={product.images && product.images.length > 0 
                         ? product.images[0] 
                         : 'product-1.png'}
                  product={product.name}
                  farmer={product.farmerId ? product.farmerId.farmName : 'Fermer'}
                  desc={product.description.length > 100 
                        ? product.description.substring(0, 100) + '...' 
                        : product.description}
                  price={product.price}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Products;