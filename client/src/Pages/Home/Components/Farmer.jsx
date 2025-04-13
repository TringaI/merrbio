import React from 'react'

function Farmer() {
    return (
        <div className='w-full flex flex-col mt-20 items-center justify-center'>
            <div className='w-[80vw] grid grid-cols-12 gap-3'>
                <div className="col-span-3 h-full flex flex-col justify-center">
                    <h1 className='poppins text-3xl'>Njihuni me </h1>
                    <h1 className='moret  text-6xl uppercase font-medium underline-wavy-green'>Fermeret</h1>
                </div>
                <div className="col-span-3 h-full flex items-center justify-center">
                    <img src="/images/farmers/farmer-1.jpg" className='w-full h-[300px] object-cover' alt="" />
                </div>
                <div className="col-span-3">
                    <img src="/images/farmers/farmer-2.jpg" className='w-full h-[400px] object-cover' alt="" />
                </div>
                <div className="col-span-3 flex items-center">
                    <img src="/images/farmers/farmer-3.png" className='w-full h-[300px] object-cover' alt="" />
                </div>
            </div>

        </div>
    )
}

export default Farmer