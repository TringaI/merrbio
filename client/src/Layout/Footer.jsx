import React from 'react'

function Footer() {
  return (
    <div className=' w-full light-green-bg'>
      <svg xmlns="http://www.w3.org/2000/svg" className='bg-white' viewBox="0 0 1440 320"><path fill="#B7E3CC" fill-opacity="1" d="M0,128L1440,256L1440,320L0,320Z"></path></svg>
      <div className='w-full grid grid-cols-12'>
        <div className="col-span-12 md:col-span-6 flex justify-center items-center">
          <h1 className="moret text-5xl">MerrBio</h1>
        </div>
        <div className="col-span-12 lg:col-span-6 flex flex-col items-center justify-center">
          <div>
            <p className='poppins'>Email: <span className='font-medium'>info@merrbio.com</span></p>
            <p className='poppins'>Lokacioni: <span className="font-medium">Rruga Skenderbeu</span></p>
            <p className='poppins'>Rrjetet Sociale: <span className="font-medium">merrbio</span></p>
          </div>
        </div>

      </div>
      <div className="w-full dark-green-bg flex items-center justify-center mt-10"><p className='text-white moret text-xl'>© copyright all rights reserved</p></div>
    </div>
  )
}

export default Footer