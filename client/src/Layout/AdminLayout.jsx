import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import api from '../api/axios';

function AdminLayout() {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user has SuperAdmin or Admin role
    const checkAdminAccess = async () => {
      try {
        const userResponse = await api.get('/users/me');
        const hasAdminAccess = userResponse.data.roles && 
          (userResponse.data.roles.SuperAdmin === 9999 || userResponse.data.roles.Admin === 9001);
        
        if (!hasAdminAccess) {
          console.error('Unauthorized access attempt to admin dashboard');
          navigate('/login');
        }
      } catch (error) {
        console.error('Error checking admin access:', error);
        navigate('/login');
      }
    };

    if (!auth.isAuthenticated) {
      navigate('/login');
    } else {
      checkAdminAccess();
    }
  }, [auth.isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-white">
      <div className="w-full fixed bg-white z-20 px-20 py-5 shadow-sm">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="moret text-2xl">MerrBio Admin Panel</h1>
          <button 
            onClick={() => logout()}
            className="text-base poppins text-white blue-bg px-4 py-2 rounded-md"
          >
            Logout
          </button>
        </div>
      </div>
      <div className="container mx-auto pt-20 p-4">
        <Outlet />
      </div>
    </div>
  );
}

export default AdminLayout;