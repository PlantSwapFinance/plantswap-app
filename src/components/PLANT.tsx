import * as THREE from 'three'
import React, { useRef } from 'react'
import { Canvas, useFrame  } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'

type GLTFResult = GLTF & {
  nodes: {
    Cylinder: THREE.Mesh
  }
  materials: {
    ['Material.002']: THREE.MeshStandardMaterial
  }
}

function Model(props: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>()
  const { nodes, materials } = useGLTF('/PLANT.glb') as GLTFResult
  const mesh = useRef<THREE.Mesh>()
  useFrame(() => {
    mesh.current.rotation.z += 0.01
    mesh.current.rotation.x += 0.001
  })
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh ref={mesh} geometry={nodes.Cylinder.geometry} scale={4} material={materials['Material.002']} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 1]} />
    </group>
  )
}

const Plant: React.FC = () => (
  <Canvas style={CanvaStyle}>
    <ambientLight intensity={0.25} />
    <pointLight castShadow intensity={0.7} position={[0, 0, 12]} />
    <Model />
  </Canvas>
)

const CanvaStyle = {
  "width": "100%",
  "height": "200px",
  "top": "-75px"
}

export default Plant;

useGLTF.preload('/PLANT.glb')
