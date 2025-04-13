import React from 'react'
import ProductContainers from '../../Components/ProductContainer'
function Products() {
  return (
    <div className='pt-20 w-full flex justify-center items-center'>
          <div className='w-[80vw] grid grid-cols-12'>
              <div className="col-span-3">
                  <ProductContainers image='product-1.png' product='Domate Bio' farmer='Filan Fisteku' desc='lore impsum ipusm lorem'/>
              </div>
          </div>
    </div>
  )
}

export default Products