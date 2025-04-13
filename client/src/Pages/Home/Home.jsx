import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Banner from './Components/Banner';
import Farmer from './Components/Farmer';
import Prep from './Components/Prep'
import Contact from './Components/Contact';
function App() {
  return (
    <div className='w-full relative  py-40 flex flex-col'>
      <Banner />
      <Prep />
      <Farmer />
      <Contact />

    </div>
  );
}

export default App;
