import React from 'react'
import ReactPlayer from 'react-player'
import Page from 'components/Layout/Page'
import PageHeader from 'components/PageHeader'
import { Heading, Flex, EndPage } from '@plantswap/uikit'
import { useTranslation } from 'contexts/Localization'
import Divider from './components/Divider'

const Documentation = () => {
  const { t } = useTranslation()

  return (
    <>
      <PageHeader>
        <Flex justifyContent="space-between" flexDirection={['column', null, null, 'row']}>
          <Flex flex="1" flexDirection="column" mr={['8px', 0]}>
            <Heading as="h1" scale="xxl" color="secondary" mb="24px">
              {t('Documentation')}
            </Heading>
            <Heading scale="lg" color="text">
              {t('Learn how to connect your wallet to Plantswap')}<br />
            </Heading>
          </Flex>
          <Flex flex="1" height="fit-content" justifyContent="center" alignItems="center" mt={['24px', null, '0']}>
            <img src="/images/roadmap.svg" alt="Gardens" width={600} height={315} />
          </Flex>
        </Flex>
      </PageHeader>

      <Page>
        <Heading as="h2" size="xl" mb="14px">Connecting MetaMask to Binance Smart Chain</Heading>
        
        <ReactPlayer 
          url="https://www.youtube.com/watch?v=HVH6wpaHcDI" 
          preload="auto"
          width="100%" 
          height="500px"
          style={{  
            padding: 0,
            paddingTop: 0,
            left: 0,
            zIndex: -1,
            maxHeight: "100%",
            maxWidth: "100%",
            objectFit: "cover",
            objectPosition: "center"
          }}
        />
        <Divider />
        <EndPage />
      </Page>
    </>
  )
}

export default Documentation
