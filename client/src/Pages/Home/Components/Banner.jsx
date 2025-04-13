import React from 'react'
import ProductContainer from '../../../Components/ProductContainer'
import './Home-Components.scss' // Import CSS for animation and gradient

function Banner() {
  return (
    <div className='w-full h-full flex flex-col items-center justify-center overflow-hidden'>
      <h1 className='text-6xl md:text-8xl lg:text-9xl moret underline-wavy-green'>MerrBio</h1>
      <p className='poppins font-light text-base md:text-xl mt-10'>
        Bleni produkte 100% bio nga fermerët vendas
      </p>
      <button className='light-green-bg px-3 mt-5 py-2 rounded-md poppins text-xl md:text-2xl'>
        <a href="/360">Shikoni Produktet në <b>360</b></a>
      </button>

      <div className="relative w-[80vw] py-3 overflow-hidden mt-20">
        {/* Left Gradient Overlay */}
        <div className="absolute left-0 top-0 h-full w-16 z-10 pointer-events-none gradient-left" />

        {/* Right Gradient Overlay */}
        <div className="absolute right-0 top-0 h-full w-16 z-10 pointer-events-none gradient-right" />

        <div className="flex gap-5 slider">
          {[...Array(2)].map((_, idx) => (
            <React.Fragment key={idx}>
              <div className="w-[300px] shrink-0">
                <ProductContainer image='product-4.png' product='Mjalt Bio' farmer='Filan Fisteku' desc='Mjaltë natyral nga bletarët lokal.' />
              </div>
              <div className="w-[300px] shrink-0">
                <ProductContainer image='product-2.png' product='Paprika Bio' farmer='Filan Fisteku' desc='Paprika e rritur me përkujdesje natyrore.' />
              </div>
              <div className="w-[300px] shrink-0">
                <ProductContainer image='product-3.png' product='Tranguj Bio' farmer='Filan Fisteku' desc='Tranguj të freskët pa pesticide.' />
              </div>
              <div className="w-[300px] shrink-0">
                <ProductContainer image='product-1.png' product='Tranguj Bio' farmer='Filan Fisteku' desc='Tranguj të freskët pa pesticide.' />
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Banner
