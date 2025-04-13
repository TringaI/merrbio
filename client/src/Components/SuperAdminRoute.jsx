import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const SuperAdminRoute = ({ children }) => {
  const { auth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect superadmins to admin panel immediately using absolute URL
    if (auth.isAuthenticated && auth.roles && auth.roles.SuperAdmin === 9999) {
      window.location.href = 'http://localhost:3000/admin';
    }
  }, [auth]);

  // If we're still here and the user is a SuperAdmin, don't render children
  if (auth.roles && auth.roles.SuperAdmin === 9999) {
    return null; // Don't render anything for SuperAdmin users
  }

  // For non-SuperAdmin users, render children normally
  return children;
};

export default SuperAdminRoute;