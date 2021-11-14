import React from 'react'
import PageHeader from 'components/PageHeader'
import { Heading, Flex, EndPage } from '@plantswap/uikit'
import { useTranslation } from 'contexts/Localization'
import Divider from './components/Divider'

const Vote = () => {
  const { t } = useTranslation()

  return (
    <>
      <PageHeader>
        <Flex justifyContent="space-between" flexDirection={['column', null, null, 'row']}>
          <Flex flex="1" flexDirection="column" mr={['8px', 0]}>
            <Heading as="h1" scale="xxl" color="secondary" mb="24px">
              {t('Vote')}
            </Heading>
            <Heading scale="lg" color="text">
              {t('Vote on proposals to chose the future of PlantSwap')}<br />
              {t('when you hold PLANT in your walle')}
            </Heading>
          </Flex>
          <Flex flex="1" height="fit-content" justifyContent="center" alignItems="center" mt={['24px', null, '0']}>
            <img src="/images/roadmap.svg" alt="Gardens" width={600} height={315} />
          </Flex>
        </Flex>
      </PageHeader>
        <iframe 
          title="Snapshot Voting" 
          src="https://snapshot.org/#/plantswap.eth" 
          width="100%" 
          height="900px"
        />
        <Divider />
        <EndPage />
    </>
  )
}

export default Vote
