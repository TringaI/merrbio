import React from 'react'
import { Canvas } from '@react-three/fiber'
// import Scene from '../../Components/Scene' // Make sure this import path is correct
import { OrbitControls } from '@react-three/drei'

function Three() {
  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <Canvas>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        {/* <Scene /> */}
        <OrbitControls/>

      </Canvas>
    </div>
  )
}

export default Three
