import React from 'react'

function Login() {
  return (
    <div className='w-full flex items-center justify-center'>
        <div className='w-[80vw]  grid grid-cols-12 rounded-xl h-[90vh] mt-10'>
            <div className="col-span-6 flex light-green-bg items-center rounded-tl-xl rounded-bl-xl justify-center">
                <h1 className='moret text-8xl'>MerrBio</h1>
            </div>
            <div className="col-span-6 pl-10 flex flex-col h-full form-side-containers justify-center rounded-tr-xl rounded-br-xl">
                    <h1 className='poppins text-3xl font-medium'>Kycuni ne llogarine tuaj</h1>
                    <input className='w-[80%] rounded-md form-inputs px-3 py-3 mt-5' placeholder='Emri perdoruesit...' type="text" />
                    <input className='w-[80%] rounded-md form-inputs px-3 py-3 mt-5' placeholder='Fjalekalimi...' type="text" />
                    <button className='poppins text-base font-normal w-fit mt-3 px-6 py-2 light-green-bg'>kycuni</button>
            </div>
        </div>
    </div>
  )
}

export default Login