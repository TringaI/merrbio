import React from 'react'
import './Components.scss'

function DashboardProducts(props) {
  return (
    <div className='w-full p-3 rounded-md product-containers'>
        <img src={`/images/product-images/${props.image}`} className='w-full object-cover h-[200px] rounded-md' alt="" />
        
        <h1 className="poppins text-2xl font-medium mt-3 ">{props.product}</h1>
        <h2 className="poppins text-base mt-1 text-gray-500">{props.farmer}</h2>
        <p className="text-sm mt-3 poppins font-light text-gray-500">
            {props.desc}
        </p>
        <hr />
        <button className="mt-5 light-green-bg px-3 py-2 rounded-md">
                <a href="" className="poppins">Shiko Produktin</a>
        </button>
    </div>
  )
}

export default DashboardProducts