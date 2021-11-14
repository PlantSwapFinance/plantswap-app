import * as THREE from 'three'
import React, { useRef } from 'react'
import { useFrame  } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'
import Brew from 'components/Assets3D/BREW'
import BrewSpin from 'components/Assets3D/BREWspin'

type GLTFResult = GLTF & {
  nodes: {
    meGrowBoxBottom: THREE.Mesh
    meGrowBoxMid: THREE.Mesh
    meSupportBeamBottom: THREE.Mesh
  }
  materials: {
    texture2: THREE.MeshStandardMaterial
    texture1: THREE.MeshStandardMaterial
  }
}

function VGBrewBrew(
  props: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>()
  const { nodes, materials } = useGLTF('/verticalGarden.glb') as GLTFResult
  const mesh = useRef<THREE.Mesh>()
  useFrame(() => {
    group.current.rotation.y += 0.005
  })
  
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh geometry={nodes.meGrowBoxBottom.geometry} material={materials.texture2} scale={[1, 0.47, 1]} />
      
        <group> 
          <Brew position={[0, 0, 1.25]} scale={[0.75, 0.75, 1.5]} />
          <Brew position={[0, 0, -1.25]} scale={[0.75, 0.75, 1.5]} />
          <Brew position={[1.25, 0, 0]} scale={[0.75, 0.75, 1.5]} rotation={[0, Math.PI / 2, 0]} />
          <Brew position={[-1.25, 0, 0]} scale={[0.75, 0.75, 1.5]} rotation={[0, Math.PI / 2, 0]} />

          <BrewSpin position={[0.5, 0.6, 0]} scale={[0.5, 0.5, 1]} />
          <BrewSpin position={[-0.5, 0.6, 0]} scale={[0.5, 0.5, 1]} rotation={[0, Math.PI / 2, 0]} />
          <BrewSpin position={[0, 0.6, 0.5]} scale={[0.5, 0.5, 1]} />
          <BrewSpin position={[0, 0.6, -0.5]} scale={[0.5, 0.5, 1]} rotation={[0, Math.PI / 2, 0]} />
          
          <BrewSpin position={[0.85, 0.6, 0.85]} scale={[0.5, 0.5, 1]} rotation={[0, Math.PI / 2, 0]} />
          <BrewSpin position={[0.85, 0.6, -0.85]} scale={[0.5, 0.5, 1]} />
          <BrewSpin position={[-0.85, 0.6, 0.85]} scale={[0.5, 0.5, 1]} rotation={[0, Math.PI / 2, 0]} />
          <BrewSpin position={[-0.85, 0.6, -0.85]} scale={[0.5, 0.5, 1]} />
        </group>

    </group>
  )
}

export default VGBrewBrew;

useGLTF.preload('/verticalGarden.glb')
