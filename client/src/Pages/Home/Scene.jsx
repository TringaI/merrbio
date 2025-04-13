/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.5.3 public/pickled_cucumbers/scene.gltf 
Author: epavlenko (https://sketchfab.com/epavlenko)
License: CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
Source: https://sketchfab.com/3d-models/pickled-cucumbers-eb4bd06db59b4c1686b0461051b2a1ca
Title: Pickled Cucumbers
*/

import React from 'react'
import { useGLTF } from '@react-three/drei'

export default function Model(props) {
  const { nodes, materials } = useGLTF('/scene.gltf')
  return (
    <group {...props} dispose={null}>
      <group scale={0.2}>
        <mesh geometry={nodes.pickles_glass_1_low_blinn1_0.geometry} material={materials.blinn1} />
        <mesh geometry={nodes.pickles_glass_2_low_blinn1_0.geometry} material={materials.blinn1} />
        <mesh geometry={nodes.pickles_1_low_lambert2_0.geometry} material={materials.lambert2} />
        <mesh geometry={nodes.pickles_2_low_lambert2_0.geometry} material={materials.lambert2} />
        <mesh geometry={nodes.pickles_3_low_lambert2_0.geometry} material={materials.lambert2} />
        <mesh geometry={nodes.pickles_4_low_lambert2_0.geometry} material={materials.lambert2} />
        <mesh geometry={nodes.pickles_5_low_lambert2_0.geometry} material={materials.lambert2} />
        <mesh geometry={nodes.pickles_6_low_lambert2_0.geometry} material={materials.lambert2} position={[-1155.406, -733.194, -1073.299]} rotation={[-0.184, 0.023, -0.392]} scale={0.814} />
        <mesh geometry={nodes.pickles_7_low_lambert2_0.geometry} material={materials.lambert2} />
        <mesh geometry={nodes.pickles_8_low_lambert2_0.geometry} material={materials.lambert2} />
        <mesh geometry={nodes.pickles_9_low_lambert2_0.geometry} material={materials.lambert2} />
        <mesh geometry={nodes.pickles_10_low_lambert2_0.geometry} material={materials.lambert2} />
        <mesh geometry={nodes.pickles_11_low_lambert2_0.geometry} material={materials.lambert2} />
        <mesh geometry={nodes.pickles_12_low_lambert2_0.geometry} material={materials.lambert2} />
        <mesh geometry={nodes.pickles_13_low_lambert2_0.geometry} material={materials.lambert2} />
        <mesh geometry={nodes.pickles_14_low_lambert2_0.geometry} material={materials.lambert2} />
        <mesh geometry={nodes.pickles_15_low_lambert2_0.geometry} material={materials.lambert2} />
        <mesh geometry={nodes.pickles_label_label_0.geometry} material={materials.label} />
      </group>
    </group>
  )
}

useGLTF.preload('/scene.gltf')
