import React from 'react'

function ProductSpecofic() {
  return (
    <div className='w-full mt-40 flex items-center justify-center'>
        <div className='w-[80vw] grid gap-5 grid-cols-12'>
            <div className="col-span-6">
              <img className='rounded-md' src="/images/product-images/product-1.png" alt="" />
            </div>
            <div className="col-span-6 flex flex-col border-l-[#478e69] border-l-2 pl-5">
                <h1 className='moret text-5xl'>Domate Bio</h1>
                <p className='poppins text-gray-500 text-xl'>Fermer: Filan Fisteku</p>
                <p className='poppins text-gray-600 text-base mt-10'>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Laborum maiores ipsa maxime porro quis neque quo quaerat magni repellat, 
                  sapiente unde natus quibusdam fugiat, recusandae impedit! Reiciendis dignissimos cupiditate magnam?
                </p>
                <p className='poppins text-gray-600 text-base mt-5'>
                  Cmimi: <span className='font-medium'>40$</span>
                </p>
                <a href='' className="underline-wavy-green poppins mt-5 text-xl font-medium">Shikoni produktin ne 360</a>
                <button className='mt-5 light-green-bg text-xl poppins w-fit py-2 px-4'>Beni kerkese per blejre</button>
            </div>
        </div>
    </div>
  )
}

export default ProductSpecofic