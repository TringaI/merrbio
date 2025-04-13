import React from 'react'

function Contact() {
  return (
    <div className='w-full flex items-center justify-center mt-20'>
        <div className='w-[80vw] grid grid-cols-12'>
            <div className="col-span-12 md:col-span-6 flex justify-center items-center">
                <h1 className="text-5xl md:text-7xl moret underline-wavy-green">Na Kontaktoni</h1>
            </div>
            <div className="col-span-12 md:col-span-6 flex flex-col mt-10 md:mt-0">
                <input className='form-inputs px-4 py-3 poppins ' type="text" placeholder='Emri...'/>
                <input className='form-inputs px-4 py-3 mt-5 poppins' type="text" placeholder='Numri Kontaktues...'/>
                <input className='form-inputs px-4 py-3 mt-5 poppins ' type="text" placeholder='Email...'/>
                <input className='form-inputs px-4 py-3 mt-5 poppins ' type="text" placeholder='Message...'/>
                <button className="dark-green-bg text-white py-2 px-4 poppins w-fit mt-5">Dergo</button>
            </div>
        </div>
    </div>
  )
}

export default Contact