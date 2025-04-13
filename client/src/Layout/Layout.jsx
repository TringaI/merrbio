import React from 'react'
import Navigation from './Navigation'
import { Outlet } from 'react-router-dom'

function Layout() {
  return (
    <div className='w-full flex flex-col'>
        <Navigation/>
        <Outlet />
    </div>
  )
}

export default Layout