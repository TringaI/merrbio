import React from 'react'

function Navigation() {
  return (
    <div className='w-full fixed grid grid-cols-12 bg-white z-20 px-20 py-5'>
        <div className="col-span-3">
            <img src="" alt="" />
        </div>
        <div className="col-span-9 flex gap-5 justify-end items-center">
            <a href="/" className='text-base poppins text-gray-600 font-normal'>Ballina</a>
            <a href="/produktet" className='text-base poppins text-gray-600  font-normal'>Produktet</a>
            <a href="/fermeret" className='text-base poppins  text-gray-600 font-normal'>Fermeret</a>
            <a href="/krijo" className='text-base poppins  text-gray-600 font-normal'>Krijo Pjaten</a>
            <a href="/profili" className='text-base poppins  text-gray-600 font-semibold light-green-bg px-4 py-1 rounded-md '>Profili</a>
        </div>
    </div>
  )
}

export default Navigation