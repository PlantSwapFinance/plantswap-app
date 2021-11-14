import * as THREE from 'three'
import React, { useRef } from 'react'
import { useFrame  } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'
import Plant from 'components/Assets3D/PLANT'
import PlantSpin from 'components/Assets3D/PLANTspin'
import Eggp from 'components/Assets3D/EGGP'
import EggpSpin from 'components/Assets3D/EGGPspin'

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

function VGEggpEggpPlant(
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
        <mesh
          geometry={nodes.meGrowBoxMid.geometry}
          material={nodes.meGrowBoxMid.material}
          position={[0, 1.56, 0]}
          scale={[0.75, 0.27, 0.75]}
        />
        <mesh
          geometry={nodes.meSupportBeamBottom.geometry}
          material={nodes.meSupportBeamBottom.material}
          position={[0, 0.7, 0]}
          scale={[0.2, 0.6, 0.2]}
        />
      </group>
      
        <group> 
          <Eggp position={[0, 0, 1.25]} scale={[0.75, 0.75, 1.5]} />
          <Eggp position={[0, 0, -1.25]} scale={[0.75, 0.75, 1.5]} />
          <Eggp position={[1.25, 0, 0]} scale={[0.75, 0.75, 1.5]} rotation={[0, Math.PI / 2, 0]} />
          <Eggp position={[-1.25, 0, 0]} scale={[0.75, 0.75, 1.5]} rotation={[0, Math.PI / 2, 0]} />

          <Plant position={[0, 1.5, 0.9]} scale={[0.5, 0.5, 1.5]} />
          <Plant position={[0, 1.5, -0.9]} scale={[0.5, 0.5, 1.5]} />
          <Plant position={[0.9, 1.5, 0]} scale={[0.5, 0.5, 1.5]} rotation={[0, Math.PI / 2, 0]} />
          <Plant position={[-0.9, 1.5, 0]} scale={[0.5, 0.5, 1.5]} rotation={[0, Math.PI / 2, 0]} />

          <PlantSpin position={[0.5, 2, 0]} scale={[0.5, 0.5, 1]} />
          <PlantSpin position={[-0.5, 2, 0]} scale={[0.5, 0.5, 1]} />
          <PlantSpin position={[0, 2, 0.5]} scale={[0.5, 0.5, 1]} />
          <PlantSpin position={[0, 2, -0.5]} scale={[0.5, 0.5, 1]} />

          <EggpSpin position={[0.5, 0.6, 0]} scale={[0.5, 0.5, 1]} />
          <EggpSpin position={[-0.5, 0.6, 0]} scale={[0.5, 0.5, 1]} rotation={[0, Math.PI / 2, 0]} />
          <EggpSpin position={[0, 0.6, 0.5]} scale={[0.5, 0.5, 1]} />
          <EggpSpin position={[0, 0.6, -0.5]} scale={[0.5, 0.5, 1]} rotation={[0, Math.PI / 2, 0]} />
          
          <EggpSpin position={[0.85, 0.6, 0.85]} scale={[0.5, 0.5, 1]} rotation={[0, Math.PI / 2, 0]} />
          <EggpSpin position={[0.85, 0.6, -0.85]} scale={[0.5, 0.5, 1]} />
          <EggpSpin position={[-0.85, 0.6, 0.85]} scale={[0.5, 0.5, 1]} rotation={[0, Math.PI / 2, 0]} />
          <EggpSpin position={[-0.85, 0.6, -0.85]} scale={[0.5, 0.5, 1]} />
        </group>

    </group>
  )
}

export default VGEggpEggpPlant;

useGLTF.preload('/verticalGarden.glb')
