import React from 'react'
import Navigation from './Navigation'
import { Outlet } from 'react-router-dom'
import Footer from './Footer'
function Layout() {
  return (
    <div className='w-full flex flex-col'>
        <Navigation/>
        <Outlet />
        <Footer/>
    </div>
  )
}

export default Layout