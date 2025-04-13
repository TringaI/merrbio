import React, { useState } from 'react'
import DashboardProducts from '../../../Components/DashboardProducts'
import AddProducts from './Components/AddProducts'
import Approval from './Components/Approval'
import Sales from './Components/Sales'

function Dashboard() {
  // State for active component and header text
  const [activeComponent, setActiveComponent] = useState('products');
  const [headerText, setHeaderText] = useState('Lista e produkteve');

  const handleButtonClick = (component, text) => {
    setActiveComponent(component);
    setHeaderText(text);
  };

  return (
    <div className='w-full flex pt-40 justify-center items-center '>
      <div className='w-[80vw] bg-white grid grid-cols-12 rounded-md'>
        <div className="rounded-md col-span-3 p-5 flex flex-col">
          <div className="flex w-full">
            <img src="/images/icons/list.png" className='dark-green-bg w-[30px] h-fit p-1 object-contain' alt="" />
            <button
              className='poppins text-base text-left rounded-md w-fit ml-2'
              onClick={() => handleButtonClick('products', 'Lista e produkteve')}
            >
              Lista e produkteve
            </button>
          </div>
          <div className="flex w-full mt-2 items-center">
            <img src="/images/icons/plus.png" alt="" className='dark-green-bg w-[30px] h-fit p-1 object-contain' />
            <button
              className='poppins text-base text-left rounded-md w-fit ml-2'
              onClick={() => handleButtonClick('addProducts', 'Shto Produkte')}
            >
              Shto Produkte
            </button>
          </div>
          <div className="flex w-full mt-2">
            <img src="/images/icons/loading.png" className='dark-green-bg w-[30px] p-1 h-fit object-contain' alt="" />
            <button
              className='poppins text-base text-left rounded-md w-fit ml-2'
              onClick={() => handleButtonClick('approval', 'Per Aprovim')}
            >
              Per Aprovim
            </button>
          </div>
          <div className="flex w-full mt-2">
            <img src="/images/icons/trend.png" className='dark-green-bg w-[30px] p-1 h-fit object-contain' alt="" />
            <button
              className='poppins text-base text-left rounded-md w-fit ml-2'
              onClick={() => handleButtonClick('sales', 'Shitjet')}
            >
              Shitjet
            </button>
          </div>
        </div>
        <div className="col-span-9 p-5 flex flex-col">
          <h1 className='moret text-4xl'>{headerText}</h1>
          <hr />
          <br />
          {activeComponent === 'products' && <DashboardProducts image='product-1.png' product='Domate Bio' desc='lorem ipsum ' />}
          {activeComponent === 'addProducts' && <AddProducts />}
          {activeComponent === 'approval' && <Approval />}
          {activeComponent === 'sales' && <Sales />}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
