import React, { useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

export default function Scene({ autoRotate = true, ...props }) {
  const { scene } = useGLTF('/pickles2/scene.gltf');
  
  // Auto-rotation animation
  useFrame(() => {
    if (autoRotate && scene) {
      // Rotate only the model's own axes
      scene.rotation.y += 0.01; // Adjust speed as needed
      // Uncomment these if you want rotation on other axes too
      // scene.rotation.x += 0.005; // rotation around X axis
      // scene.rotation.z += 0.005; // rotation around Z axis
    }
  });

  return (
    <group {...props}>
      <primitive object={scene} />
    </group>
  );
}

// Preload the model
useGLTF.preload('/pickles2/scene.gltf');
