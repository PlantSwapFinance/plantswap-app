import React, { useRef } from 'react'
import { Canvas } from '@react-three/fiber';
import { Box } from "@react-three/drei";
import Page from 'components/Layout/Page'
import PageHeader from 'components/PageHeader'
import { Heading, Flex, EndPage } from '@plantswap/uikit'
import { useTranslation } from 'contexts/Localization'


const PlantArt = () => {
  const { t } = useTranslation()
  const ref = useRef()

  return (
    <>
      <PageHeader>
        <Flex justifyContent="space-between" flexDirection={['column', null, null, 'row']}>
          <Flex flex="1" flexDirection="column" mr={['8px', 0]}>
            <Heading as="h1" scale="xxl" color="secondary" mb="24px">
              {t('Plant Art')}
            </Heading>
            <Heading scale="lg" color="text">
              {t('Read our roadmap to discover what is next')}<br />
              {t('for the future of PlantSwap.finance and the PLANT token!')}
            </Heading>
          </Flex>
          <Flex flex="1" height="fit-content" justifyContent="center" alignItems="center" mt={['24px', null, '0']}>
            <img src="/images/roadmap.svg" alt="Gardens" width={600} height={315} />
          </Flex>
        </Flex>
      </PageHeader>
      <Page>
        <Canvas style={CanvaStyle}>
        <group
      ref={ref}
      dispose={null}
    //  onPointerOver={(e) => (e.stopPropagation(), set(e.object.material.name))}
     // onPointerOut={(e) => e.intersections.length === 0 && set(null)}
    //  onPointerMissed={ () => ({ state.current = null }) }
    //  onPointerDown={(e) => ({ e.stopPropagation(), (state.current = e.object.material.name) })}
    >

        <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[1, 1, 1]}>
      <planeBufferGeometry />
      <meshBasicMaterial color="green" />
    </mesh>
    </group>

            <Box args={[1, 1, 1]} position={[2, 0, 0]} />
            <Box args={[1, 1, 1]} position={[1, 0, 0]} />
            <Box args={[1, 1, 1]} position={[0, 0, 0]} />
            <Box args={[1, 1, 1]} position={[-1, 0, 0]} />
            <Box args={[1, 1, 1]} position={[-2, 0, 0]} />
            
            <Box args={[1, 1, 1]} position={[2, 1, 0]} />
            <Box args={[1, 1, 1]} position={[1, 1, 0]} />
            <Box args={[1, 1, 1]} position={[0, 1, 0]} />
            <Box args={[1, 1, 1]} position={[-1, 1, 0]} />
            <Box args={[1, 1, 1]} position={[-2, 1, 0]} />
          <ambientLight intensity={0.5} />
          <pointLight castShadow intensity={0.7} position={[10, 10, 10]} />
        </Canvas>
        <EndPage />
      </Page>
    </>
  )
}

const CanvaStyle = {
  "width": "100%",
  "height": "400px"
}

export default PlantArt
