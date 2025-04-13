import React from 'react'
import './Components.scss'
function DashboardProducts(props) {
  return (
    <div className='grid grid-cols-12 w-full'>
      <div className='col-span-4'>
        <div className='w-full p-3 rounded-md product-containers'>
          <img src={`/images/product-images/${props.image}`} className='w-full object-cover h-[200px] rounded-md' alt="" />

          <h1 className="poppins text-2xl font-medium mt-3 ">{props.product}</h1>
          <h2 className="poppins text-base mt-1 text-gray-500">{props.farmer}</h2>
          <p className="text-sm mt-3 poppins font-light text-gray-500">
            {props.desc}
          </p>
          <hr />
          <div className="flex justify-end w-full mt-3">
            <button className="w-[25px]">
              <img src="/images/icons/edit.png" alt="" />
            </button>
            <button className="w-[25px] ml-2">
              <img src="/images/icons/delete.png" alt="" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardProducts