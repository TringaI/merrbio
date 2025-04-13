import React from 'react'
import ProductContainers from '../../Components/ProductContainer'
function Products() {
  return (
    <div className='pt-20 w-full flex justify-center items-center'>
          <div className='w-[80vw] grid grid-cols-12'>
              <div className="col-span-3">
                  <ProductContainers image='' product='' farmer='' desc=''/>
              </div>
          </div>
    </div>
  )
}

export default Products