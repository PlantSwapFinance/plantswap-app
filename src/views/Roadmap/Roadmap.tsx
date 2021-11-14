import React from 'react'
import Page from 'components/Layout/Page'
import PageHeader from 'components/PageHeader'
import { Heading, Text, Flex, EndPage } from '@plantswap/uikit'
import { useTranslation } from 'contexts/Localization'
import Divider from './components/Divider'

const Roadmap = () => {
  const { t } = useTranslation()

  return (
    <>
      <PageHeader>
        <Flex justifyContent="space-between" flexDirection={['column', null, null, 'row']}>
          <Flex flex="1" flexDirection="column" mr={['8px', 0]}>
            <Heading as="h1" scale="xxl" color="secondary" mb="24px">
              {t('Roadmap')}
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
          <Heading as="h2" size="xl" mb="14px">Short-term Roadmap</Heading>
            <br />
            <Text>Announce of the Presale details (10 April 2021)</Text>
            <Text>Fair Presale of the $PLANT token on Bounce (12 to 19 April 2021)</Text>
            <Text>Add initial liquidity for PLANT/BNB (75% of Presale BNB profits) (21 April 2021)</Text>
            <Text>Launch the initial PLANT/BNB and PLANT/BUSD farm and the PLANT garden (21 April 2021)</Text>
            <br />
          <Heading as="h2" size="xl" mb="14px">Long-term Roadmap</Heading>
            <br />
            <Text>Development of the barn to see all of your farming across multiple DeFi platform (Q2 2021)</Text>
            <Text>Adding control and emergency tools to the barn to control, remove your spending approval and emergency withdraw from other smart contracts (Q2 2021)</Text>
            <Text>Partnering with other projects for multiple cross-project pools and gardens (Q2 2021)</Text>
            <Text>Addition of multiple liquidity pools with stable coins and other wrapped tokens</Text>
            <Text>Creation and distribution of a governance token</Text>
            <Text>Smart Contract Audit (Q3 2021)</Text>
            <Text>Cross-chain compatibility (Q3 2021)</Text>
            <Text>Much more</Text>
          <br /><br />
        <Divider />
        <EndPage />
      </Page>
    </>
  )
}

export default Roadmap
