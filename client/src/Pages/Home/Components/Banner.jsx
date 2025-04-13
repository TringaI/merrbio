import React from 'react'
import ProductContainer from '../../../Components/ProductContainer'
import { motion } from 'framer-motion'
import './Home-Components.scss'

function Banner() {
  return (
    <div className='w-full h-full flex flex-col items-center justify-center relative overflow-hidden'>
      <img src="/images/icons/cabbage.png" className='absolute w-[8vw] top-[2vw] left-[15vw] -rotate-6' alt="" />
      <img src="/images/icons/carrot.png" className='absolute w-[8vw] top-[2vw] right-[15vw] ' alt="" />
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className='text-6xl md:text-8xl lg:text-9xl moret underline-wavy-green'
      >
        MerrBio
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        className='poppins font-light text-base md:text-xl mt-10 text-center'
      >
        Bleni produkte 100% bio nga fermerët vendase
      </motion.p>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className='light-green-bg px-3 mt-5 py-2 rounded-md poppins text-xl md:text-2xl transition-all duration-300'
      >
        <a href="/360">Shikoni Produktet në <b>360</b></a>
      </motion.button>

      <div className="relative w-[80vw] py-3 overflow-hidden mt-20">
        <div className="absolute left-0 top-0 h-full w-16 z-10 pointer-events-none gradient-left" />
        <div className="absolute right-0 top-0 h-full w-16 z-10 pointer-events-none gradient-right" />

        <motion.div
          className="flex gap-5 slider"
          animate={{ x: ['0%', '-50%'] }}
          transition={{
            repeat: Infinity,
            duration: 20,
            ease: 'linear',
          }}
        >
          {[...Array(2)].map((_, idx) => (
            <React.Fragment key={idx}>
              <div className="w-[300px] shrink-0">
                <ProductContainer image='product-4.png' product='Ginger Shot' farmer='Filan Fisteku' price="30" desc='Mjaltë natyral nga bletarët lokal.' />
              </div>
              <div className="w-[300px] shrink-0">
                <ProductContainer image='product-2.png' product='Paprika Bio' farmer='Filan Fisteku' price="15" desc='Paprika e rritur me përkujdesje natyrore.' />
              </div>
              <div className="w-[300px] shrink-0">
                <ProductContainer image='product-3.png' product='Tranguj Bio' farmer='Filan Fisteku' price="10" desc='Tranguj të freskët pa pesticide.' />
              </div>
              <div className="w-[300px] shrink-0">
                <ProductContainer image='product-1.png' product='Domate Bio' farmer='Filan Fisteku' price="11" desc='Dimate të freskëta pa pesticide.' />
              </div>
            </React.Fragment>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

export default Banner
