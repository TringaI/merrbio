import React from 'react'

function Dashboard() {
  return (
    <div className='w-full flex pt-40 justify-center items-center '>
      <div className='w-[80vw] bg-white grid grid-cols-12 rounded-md'>
        <div className="rounded-md col-span-3  p-5 flex flex-col ">
          <div className="flex w-full">
            <img src="/images/icons/list.png" className='dark-green-bg w-[30px] h-fit p-1 object-contain' alt="" />
            <button className='poppins text-base text-left rounded-md w-fit ml-2 '>Lista e produkteve</button>
          </div>
          <div className="flex w-full mt-2 items-center">
            <img src="/images/icons/plus.png" alt="" className='dark-green-bg w-[30px] h-fit p-1 object-contain' />
            <button className='poppins text-base text-left rounded-md  w-fit ml-2 '>Shto Produkte</button>
          </div>
          <div className="flex w-full mt-2">
            <img src="/images/icons/loading.png" className='dark-green-bg w-[30px] p-1 h-fit object-contain' alt="" />
            <button className='poppins text-base text-left rounded-md  w-fit ml-2'>Per Aprovim</button>
          </div>
          <div className="flex w-full mt-2">
            <img src="/images/icons/trend.png" className='dark-green-bg w-[30px] p-1 h-fit object-contain' alt="" />
            <button className='poppins text-base text-left rounded-md  w-fit ml-2'>Shitjet</button>
          </div>
        </div>
        <div className="col-span-9 p-5">
          <h1 className='moret text-4xl'>Lista e produkteve</h1>
          <hr />
        </div>
      </div>
    </div>
  )
}

export default Dashboard