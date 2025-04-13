import React from 'react'

function Footer() {
  return (
    <div className=' w-full light-green-bg'>
      <svg xmlns="http://www.w3.org/2000/svg" className='bg-white' viewBox="0 0 1440 320"><path fill="#B7E3CC" fill-opacity="1" d="M0,128L1440,256L1440,320L0,320Z"></path></svg>
      <div className='w-full grid grid-cols-12'>
        <div className="col-span-6 flex justify-center items-center">
          <h1 className="moret text-5xl">MerrBio</h1>
        </div>
        <div className="col-span-6 flex flex-col items-center justify-center">
          <p className='poppins'>Email: info@merrbio.com</p>
        </div>
      </div>

    </div>
  )
}

export default Footer