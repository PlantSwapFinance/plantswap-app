import React from 'react'
import Page from 'components/Layout/Page'
import PageHeader from 'components/PageHeader'
import { Heading, Text, Flex, EndPage } from '@plantswap/uikit'
import { useTranslation } from 'contexts/Localization'
import Divider from './components/Divider'


const Tree = () => {
  const { t } = useTranslation()

  return (
    <>
      <PageHeader>
        <Flex justifyContent="space-between" flexDirection={['column', null, null, 'row']}>
          <Flex flex="1" flexDirection="column" mr={['8px', 0]}>
            <Heading as="h1" scale="xxl" color="secondary" mb="24px">
              {t('Tree Token')}
            </Heading>
            <Heading scale="lg" color="text">
              {t('Decentralize gouvernance for the')}<br />
              {t('PlantSwap Development Fund')}
            </Heading>
          </Flex>
          <Flex flex="1" height="fit-content" justifyContent="center" alignItems="center" mt={['24px', null, '0']}>
            <img src="/images/tree.svg" alt="Gardens" width={250} height={250} />
          </Flex>
        </Flex>
      </PageHeader>
      <Page>
          <Heading as="h2" size="xl" mb="14px">Why holding the Tree token?</Heading>
            <br />
            <Text>-Vote on the allocation in donation to each organisme</Text>
            <Text>-Suggest new new non profits and allocation</Text>
            <Text>-Vote on tokenomic of the platform, futur farms and pools</Text>
            <Text>-Vote on the development priority</Text>
            <br />
          <Heading as="h2" size="xl" mb="14px">A decentralized autonomous foundation, this is our goal!</Heading>
            <br />
            <Text>A word of caution, this entire platform is a real world experiment, this project is in current development (dev in prod), invest at your own risk.</Text>
            <Text>If you want to contribute one way or a other to this project, please contact us on Telegram or Twitter.</Text>
            <Text>Let&apos;s make the world a better place all together.</Text>
          <br />
        <Divider />
        <EndPage />
      </Page>
    </>
  )
}

export default Tree
