import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './Layout/Layout';
import AdminLayout from './Layout/AdminLayout';
import Home from './Pages/Home/Home';
import ProductSpecific from './Pages/Products/ProductSpecific';
import Login from './Pages/Login/Login'
import Signup from './Pages/Signup/Signup'
import Products from './Pages/Products/Products'
import Plate from './Pages/Plate/Plate';
import Three from './Pages/Products/Three';
import Messages from './Pages/Messages/index';
import Profile from './Pages/Profile/Profile'
import Dashboard from './Pages/Profile/Dashboard/Dashboard';
import AdminDashboard from './Pages/Admin/AdminDashboard';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/language/LanguageContext';
import ProtectedRoute from './Components/ProtectedRoute';
import SuperAdminRoute from './Components/SuperAdminRoute';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <LanguageProvider>
          <Routes>
            <Route path='/' element={<SuperAdminRoute><Layout /></SuperAdminRoute>}>
              <Route index element={<SuperAdminRoute><Home /></SuperAdminRoute>} />
              <Route path='/profili' element={
                <SuperAdminRoute>
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                </SuperAdminRoute>
              } />
              <Route path='/mesazhet' element={
                <SuperAdminRoute>
                  <ProtectedRoute>
                    <Messages />
                  </ProtectedRoute>
                </SuperAdminRoute>
              } />
              <Route path='/produktet' element={<SuperAdminRoute><Products /></SuperAdminRoute>} />
              <Route path='/profili-fermerit' element={<SuperAdminRoute><Dashboard /></SuperAdminRoute>} />
              <Route path='/detajet' element={<SuperAdminRoute><ProductSpecific /></SuperAdminRoute>} />
              <Route path='/360' element={<Three />} />

              <Route path='/360' element={<Three />} />
              <Route path='/krijo' element={<Plate />} />
            </Route >

            {/* Admin Routes */}
            < Route path="/admin" element={< AdminLayout />}>
              <Route index element={<AdminDashboard />} />
            </Route >

            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<SuperAdminRoute><Signup /></SuperAdminRoute>} />
          </Routes >
        </LanguageProvider>
      </AuthProvider >
    </BrowserRouter >
  </React.StrictMode >
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();