import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import Scene from './Scene';
import { OrbitControls } from '@react-three/drei';
import Banner from './Components/Banner';
import Farmer from './Components/Farmer';
import Prep from './Components/Prep'
function App() {
  return (
    <div className='w-full relative  py-40 flex flex-col'>
      {/* <img src="/images/decors/banner-top.png" alt="" /> */}
     <Banner/>
     <Prep/>
     <Farmer/>
      {/* <div className="w-full grid grid-cols-12">
          <div className="col-span-6"></div>
          <div className="col-span-6 flex justify-end">
            <img src="/images/decors/tomatos.png" className='h-[100vh] w-auto' alt="" />
          </div>
        </div> */}
    </div>
  );
}

export default App;
