import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import useAuth from '../../hooks/useAuth';
import UserManagement from './Components/UserManagement';
import ProductManagement from './Components/ProductManagement';
import CategoryManagement from './Components/CategoryManagement';
import FarmerManagement from './Components/FarmerManagement';
import OrderManagement from './Components/OrderManagement';
import DashboardOverview from './Components/DashboardOverview';

function AdminDashboard() {
  const [activeComponent, setActiveComponent] = useState('overview');
  const [headerText, setHeaderText] = useState('Përmbledhje e Panelit');
  const { auth } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user has SuperAdmin role
    const checkAdminAccess = async () => {
      try {
        const userResponse = await api.get('/users/me');
        const hasAdminAccess = userResponse.data.roles && 
          (userResponse.data.roles.SuperAdmin === 9999 || userResponse.data.roles.Admin === 9001);
        
        if (!hasAdminAccess) {
          console.error('Nuk jen i autorizuar');
          navigate('/profili');
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error checking admin access:', error);
        navigate('/login');
      }
    };

    checkAdminAccess();
  }, [navigate]);

  const handleButtonClick = (component, text) => {
    setActiveComponent(component);
    setHeaderText(text);
  };

  // Function to handle button clicks from DashboardOverview
  const handleTabChange = (component, text) => {
    setActiveComponent(component);
    setHeaderText(text);
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <img src="/images/icons/loading.png" className="w-[50px] animate-spin" alt="Loading..." />
      </div>
    );
  }

  return (
    <div className='w-full flex pt-40 justify-center items-center'>
      <div className='w-[90vw] bg-white grid grid-cols-12 rounded-md shadow-md'>
        <div className="rounded-md col-span-2 p-5 flex flex-col light-green-bg min-h-[calc(100vh-200px)]">
          <h2 className="moret text-xl mb-6 text-center">Paneli Admin</h2>
          
          {/* Navigation Menu */}
          <div className="w-full">
            <div 
              className={`flex w-full items-center p-3 mb-2 rounded-md cursor-pointer ${activeComponent === 'overview' ? 'dark-green-bg text-white' : 'hover:bg-white hover:bg-opacity-30'}`}
              onClick={() => handleButtonClick('overview', 'Përmbledhje e Panelit')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              <span className="poppins text-base">Përmbledhje</span>
            </div>
            
            <div 
              className={`flex w-full items-center p-3 mb-2 rounded-md cursor-pointer ${activeComponent === 'users' ? 'dark-green-bg text-white' : 'hover:bg-white hover:bg-opacity-30'}`}
              onClick={() => handleButtonClick('users', 'Menaxhimi i Përdoruesve')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span className="poppins text-base">Përdoruesit</span>
            </div>
            
            <div 
              className={`flex w-full items-center p-3 mb-2 rounded-md cursor-pointer ${activeComponent === 'products' ? 'dark-green-bg text-white' : 'hover:bg-white hover:bg-opacity-30'}`}
              onClick={() => handleButtonClick('products', 'Menaxhimi i Produkteve')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span className="poppins text-base">Produktet</span>
            </div>
            
            <div 
              className={`flex w-full items-center p-3 mb-2 rounded-md cursor-pointer ${activeComponent === 'categories' ? 'dark-green-bg text-white' : 'hover:bg-white hover:bg-opacity-30'}`}
              onClick={() => handleButtonClick('categories', 'Menaxhimi i Kategorive')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <span className="poppins text-base">Kategoritë</span>
            </div>
            
            <div 
              className={`flex w-full items-center p-3 mb-2 rounded-md cursor-pointer ${activeComponent === 'farmers' ? 'dark-green-bg text-white' : 'hover:bg-white hover:bg-opacity-30'}`}
              onClick={() => handleButtonClick('farmers', 'Menaxhimi i Fermerëve')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="poppins text-base">Fermerët</span>
            </div>
            
            <div 
              className={`flex w-full items-center p-3 mb-2 rounded-md cursor-pointer ${activeComponent === 'orders' ? 'dark-green-bg text-white' : 'hover:bg-white hover:bg-opacity-30'}`}
              onClick={() => handleButtonClick('orders', 'Menaxhimi i Porosive')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span className="poppins text-base">Porositë</span>
            </div>
          </div>
          
          <div className="mt-auto">
            <button 
              className="w-full text-white dark-green-bg py-2 rounded-md hover:bg-opacity-90"
              onClick={() => navigate('/profili')}
            >
              Kthehu te Profili
            </button>
          </div>
        </div>
        
        <div className="col-span-10 p-5 flex flex-col">
          <h1 className='moret text-2xl mb-4'>{headerText}</h1>
          <hr className="mb-6" />
          
          {/* Content based on selected component */}
          {activeComponent === 'overview' && <DashboardOverview onTabChange={handleTabChange} />}
          {activeComponent === 'users' && <UserManagement />}
          {activeComponent === 'products' && <ProductManagement />}
          {activeComponent === 'categories' && <CategoryManagement />}
          {activeComponent === 'farmers' && <FarmerManagement />}
          {activeComponent === 'orders' && <OrderManagement />}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;