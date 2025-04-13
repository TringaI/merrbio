import React, { createContext, useState, useEffect } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

// Create the auth context
const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Check if user is already logged in on mount
  useEffect(() => {
    const verifyRefreshToken = async () => {
      try {
        const response = await api.get('/auth/refresh');
        const { accessToken, roles } = response.data;
        
        setAuth({
          accessToken,
          roles,
          isAuthenticated: true,
        });
        
        // If user is a SuperAdmin, redirect them directly to admin panel
        if (roles && roles.SuperAdmin === 9999) {
          window.location.href = 'http://localhost:3000/admin';
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    // Only verify if there's an access token in localStorage
    if (localStorage.getItem('accessToken')) {
      verifyRefreshToken();
    } else {
      setIsLoading(false);
    }
  }, [navigate]);

  // Login function
  const login = async (username, password) => {
    try {
      const response = await api.post('/auth/login', {
        username,
        password
      });

      const { accessToken, roles } = response.data;
      
      // Save token to localStorage
      localStorage.setItem('accessToken', accessToken);
      
      // Update auth context
      setAuth({
        accessToken,
        roles,
        isAuthenticated: true,
      });

      return { 
        success: true,
        roles: roles 
      };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed'
      };
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed'
      };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    }
    
    // Clear auth data even if the API call fails
    localStorage.removeItem('accessToken');
    setAuth({});
    navigate('/login');
  };

  // Auth context value
  const value = {
    auth,
    setAuth,
    login,
    logout,
    register,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;