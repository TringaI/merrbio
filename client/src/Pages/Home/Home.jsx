import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import Scene from '../../Components/Scene';
function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <Suspense fallback={null}>
          <Scene
            scale={[0.05, 0.05, 0.05]} // Made smaller (was 0.1)
            position={[0, 0, 0]}
            autoRotate={true}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
export default App;






