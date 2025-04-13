import React from 'react'
import Navigation from './Navigation'

function Layout(props) {
  return (
    <div className='w-full flex flex-col'>
        <Navigation/>
        {props.children}
    </div>
  )
}

export default Layout