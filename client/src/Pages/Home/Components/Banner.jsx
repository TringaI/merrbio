import React from 'react'
import ProductContainer from '../../../Components/ProductContainer';

function Banner() {
  return (
    <div className='w-full h-full flex flex-col items-center justify-center'>
    <h1 className='text-9xl moret underline-wavy-green'>MerrBio</h1>
    <p className='poppins font-light text-xl   mt-10'>Bleni produkte 100% bio nga fermerët vendas</p>
    <button className='light-green-bg px-3 mt-5 py-2 rounded-md poppins text-2xl'>Shikoni Produktet në <b>360</b></button>
    <div className="w-[80vw] flex mt-20 gap-5">
      <div className="w-[25%]">
        <ProductContainer image='product-4.png' product='Mjalt Bio' farmer='Filan Fisteku' />
      </div>
      <div className="w-[25%]">
        <ProductContainer image='product-2.png' product='Paprika Bio' farmer='Filan Fisteku' />
      </div>
      <div className="w-[25%]">
        <ProductContainer image='product-3.png' product='Tranguj Bio' farmer='Filan Fisteku' />
      </div>
      <div className="w-[25%]">
        <ProductContainer image='product-1.png' product='Tranguj Bio' farmer='Filan Fisteku' />
      </div>
    </div>
  </div>
  )
}

export default Banner