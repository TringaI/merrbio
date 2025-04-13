import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import LogoutButton from '../Components/LogoutButton'
import { Menu, X } from 'lucide-react' // Install lucide-react or use any icon lib
import LanguageSwitcher from '../Components/LanguageSwitcher/LanguageSwitcher'
import { useLanguage } from '../context/language/LanguageContext'

function Navigation() {
  const { auth } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <div className='w-full fixed bg-white z-20 px-5 md:px-20 py-5 shadow-md'>
      <div className="flex justify-between items-center">
        <h1 className="moret text-2xl">MerrBio</h1>

        {/* Desktop Nav */}
        <div className="hidden md:flex gap-5 items-center">
          <Link to="/" className='text-base poppins text-gray-600 font-normal'>{t('home')}</Link>
          <Link to="/produktet" className='text-base poppins text-gray-600 font-normal'>{t('products')}</Link>
          <Link to="/krijo" className='text-base poppins text-gray-600 font-normal'>{t('create_dish')}</Link>
          <LanguageSwitcher />
          {auth?.isAuthenticated ? (
            <>
              <Link to="/mesazhet" className='text-base poppins text-gray-600 font-normal'>{t('messages')}</Link>
              <Link to="/profili" className='text-base poppins font-semibold text-white dark-green-bg px-4 py-1 rounded-md'>{t('profile')}</Link>
            </>
          ) : (
            <Link to="/login" className='text-base poppins text-gray-600 font-semibold light-green-bg px-4 py-1 rounded-md'>{t('login')}</Link>
          )}
        </div>

        {/* Hamburger Button */}
        <button className="md:hidden" onClick={() => setIsOpen(true)}>
          <Menu size={28} />
        </button>
      </div>

      {/* Slide-In Mobile Menu */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-30 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-5 flex justify-between items-center border-b">
          <h2 className="moret text-xl">MerrBio</h2>
          <button onClick={() => setIsOpen(false)}>
            <X size={24} />
          </button>
        </div>
        <nav className="flex flex-col p-5 gap-4">
          <Link to="/" className='text-base poppins text-gray-600' onClick={() => setIsOpen(false)}>{t('home')}</Link>
          <Link to="/produktet" className='text-base poppins text-gray-600' onClick={() => setIsOpen(false)}>{t('products')}</Link>
          <Link to="/krijo" className='text-base poppins text-gray-600' onClick={() => setIsOpen(false)}>{t('create_dish')}</Link>
          <LanguageSwitcher />
          {auth?.isAuthenticated ? (
            <>
              <Link to="/mesazhet" className='text-base poppins text-gray-600' onClick={() => setIsOpen(false)}>{t('messages')}</Link>
              <Link to="/profili" className='text-base poppins text-white dark-green-bg px-4 py-1 rounded-md' onClick={() => setIsOpen(false)}>{t('profile')}</Link>
            </>
          ) : (
            <Link to="/login" className='text-base poppins text-gray-600 font-semibold light-green-bg px-4 py-1 rounded-md' onClick={() => setIsOpen(false)}>{t('login')}</Link>
          )}
        </nav>
      </div>
    </div>
  );
}

export default Navigation;
