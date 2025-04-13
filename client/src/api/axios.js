import axios from 'axios';

// Create an instance of axios with default configuration
const api = axios.create({
  baseURL: 'http://localhost:5000', // Server URL
  withCredentials: true, // Important for cookies
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor to attach the auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // If the error is 401 and we haven't already tried to refresh
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh the token
        const response = await axios.get('http://localhost:5000/auth/refresh', {
          withCredentials: true
        });
        
        const { accessToken } = response.data;
        
        // Update the token in localStorage
        localStorage.setItem('accessToken', accessToken);
        
        // Update the Authorization header
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
        
        // Retry the original request
        return api(originalRequest);
      } catch (err) {
        // If refresh token is invalid, redirect to login
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
        return Promise.reject(err);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;