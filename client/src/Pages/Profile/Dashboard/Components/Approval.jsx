import React from 'react'

function Approval(props) {
    return (
        <div className='w-full grid grid-cols-12 '>
            <div className="col-span-4">
                <div className='w-full p-3 rounded-md product-containers'>
                    <img src={`/images/product-images/${props.image}`} className='w-full object-cover h-[100px] rounded-md' alt="" />

                    <h1 className="poppins text-xl font-medium mt-3 ">{props.product}</h1>
                    <h2 className="poppins text-base mt-1 text-gray-500">{props.farmer}</h2>
                    <hr />
                    <button className="mt-5 light-green-bg px-2 py-1 rounded-md">
                        <a href="" className="poppins text-sm">Aprovo</a>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Approval