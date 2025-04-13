import React from 'react'
import { Link } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import LogoutButton from '../Components/LogoutButton'

function Navigation() {
  const { auth } = useAuth();
  return (
    <div className='w-full fixed grid grid-cols-12 bg-white z-20 px-20 py-5'>
        <div className="col-span-3">
            <img src="" alt="" />
        </div>
        <div className="col-span-9 flex gap-5 justify-end items-center">
            <Link to="/" className='text-base poppins text-gray-600 font-normal'>Ballina</Link>
            <Link to="/produktet" className='text-base poppins text-gray-600  font-normal'>Produktet</Link>
            <Link to="/fermeret" className='text-base poppins  text-gray-600 font-normal'>Fermeret</Link>
            <Link to="/krijo" className='text-base poppins  text-gray-600 font-normal'>Krijo Pjaten</Link>
            
            {auth?.isAuthenticated ? (
              <>
                <Link to="/profili" className='text-base poppins text-gray-600 font-semibold light-green-bg px-4 py-1 rounded-md'>Profili</Link>
                <LogoutButton />
              </>
            ) : (
              <Link to="/login" className='text-base poppins text-gray-600 font-semibold light-green-bg px-4 py-1 rounded-md'>Kyçuni</Link>
            )}
        </div>
    </div>
  )
}

export default Navigation