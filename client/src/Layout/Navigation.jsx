import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import LogoutButton from '../Components/LogoutButton'
import { Menu, X } from 'lucide-react' // Install lucide-react or use any icon lib

function Navigation() {
  const { auth } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className='w-full fixed bg-white z-20 px-5 md:px-20 py-5 shadow-md'>
      <div className="flex justify-between items-center">
        <h1 className="moret text-2xl">MerrBio</h1>

        {/* Desktop Nav */}
        <div className="hidden md:flex gap-5 items-center">
          <Link to="/" className='text-base poppins text-gray-600 font-normal'>Ballina</Link>
          <Link to="/produktet" className='text-base poppins text-gray-600 font-normal'>Produktet</Link>
          <Link to="/krijo" className='text-base poppins text-gray-600 font-normal'>Krijo Pjaten</Link>
          {auth?.isAuthenticated ? (
            <>
              <Link to="/mesazhet" className='text-base poppins text-gray-600 font-normal'>Mesazhet</Link>
              <Link to="/profili" className='text-base poppins font-semibold text-white dark-green-bg px-4 py-1 rounded-md'>Profili</Link>
            </>
          ) : (
            <Link to="/login" className='text-base poppins text-gray-600 font-semibold light-green-bg px-4 py-1 rounded-md'>Kyçuni</Link>
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
          <Link to="/" className='text-base poppins text-gray-600' onClick={() => setIsOpen(false)}>Ballina</Link>
          <Link to="/produktet" className='text-base poppins text-gray-600' onClick={() => setIsOpen(false)}>Produktet</Link>
          <Link to="/krijo" className='text-base poppins text-gray-600' onClick={() => setIsOpen(false)}>Krijo Pjaten</Link>
          {auth?.isAuthenticated ? (
            <>
              <Link to="/mesazhet" className='text-base poppins text-gray-600' onClick={() => setIsOpen(false)}>Mesazhet</Link>
              <Link to="/profili" className='text-base poppins text-white dark-green-bg px-4 py-1 rounded-md' onClick={() => setIsOpen(false)}>Profili</Link>
            </>
          ) : (
            <Link to="/login" className='text-base poppins text-gray-600 font-semibold light-green-bg px-4 py-1 rounded-md' onClick={() => setIsOpen(false)}>Kyçuni</Link>
          )}
        </nav>
      </div>
    </div>
  );
}

export default Navigation;
