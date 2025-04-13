import React, { useState, useEffect } from 'react';
import ProductContainers from '../../Components/ProductContainer';
import api from '../../api/axios';

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filtering state
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortOption, setSortOption] = useState('');
  
  // Handle search input
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle category selection
  const handleCategorySelect = (e) => {
    setSelectedCategory(e.target.value);
  };

  // Handle sort selection
  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  // Apply filters whenever search, category, or sort options change
  useEffect(() => {
    // Start with all products
    let result = [...products];
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.farmerId && product.farmerId.farmName && 
         product.farmerId.farmName.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Apply category filter
    if (selectedCategory) {
      result = result.filter(product => product.category._id === selectedCategory);
    }
    
    // Apply sorting
    if (sortOption === 'price-low-high') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'price-high-low') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortOption === 'name-a-z') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === 'name-z-a') {
      result.sort((a, b) => b.name.localeCompare(a.name));
    }
    
    setFilteredProducts(result);
  }, [searchTerm, selectedCategory, sortOption, products]);

  useEffect(() => {
    // Fetch products from the API
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await api.get('/products');
        console.log('Products data:', response.data);
        setProducts(response.data);
        setFilteredProducts(response.data); // Initially set filtered products to all products
        setLoading(false);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Ndodhi një gabim duke marrë produktet.');
        setLoading(false);
      }
    };
    
    // Fetch categories
    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories');
        setCategories(response.data);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };

    fetchProducts();
    fetchCategories();
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
        
        {/* Filters Section */}
        <div className="bg-white p-5 rounded-md shadow-sm mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label className="block poppins text-gray-700 mb-2">Kërko produktet</label>
              <input
                type="text"
                placeholder="Kërko sipas emrit, përshkrimit ose fermerit..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full p-2 border border-gray-300 rounded-md form-inputs"
              />
            </div>
            
            {/* Category Filter */}
            <div>
              <label className="block poppins text-gray-700 mb-2">Filtro sipas kategorisë</label>
              <select
                value={selectedCategory}
                onChange={handleCategorySelect}
                className="w-full p-2 border border-gray-300 rounded-md form-inputs"
              >
                <option value="">Të gjitha kategoritë</option>
                {categories.map(category => (
                  <option key={category._id} value={category._id}>
                    {category.nameAl}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Sort Options */}
            <div>
              <label className="block poppins text-gray-700 mb-2">Rendit sipas</label>
              <select
                value={sortOption}
                onChange={handleSortChange}
                className="w-full p-2 border border-gray-300 rounded-md form-inputs"
              >
                <option value="">Automatike</option>
                <option value="price-low-high">Çmimi: Ulët në të lartë</option>
                <option value="price-high-low">Çmimi: Lartë në të ulët</option>
                <option value="name-a-z">Emri: A-Z</option>
                <option value="name-z-a">Emri: Z-A</option>
              </select>
            </div>
          </div>
          
          {/* Reset Filters Button */}
          <div className="mt-4">
            <button 
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('');
                setSortOption('');
              }}
              className="light-green-bg px-4 py-2 rounded-md poppins text-gray-800 hover:opacity-90"
            >
              Rivendos filtrat
            </button>
          </div>
        </div>
        
        {filteredProducts.length === 0 ? (
          <div className="w-full p-4 bg-gray-100 rounded-md text-center">
            <p className="poppins">Nuk u gjetën produkte me këto kritere.</p>
          </div>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
            {filteredProducts.map(product => (
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