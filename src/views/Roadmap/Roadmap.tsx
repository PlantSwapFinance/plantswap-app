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
            <img src="/images/roadmap.svg" alt="PlantSwap roadmap — past milestones and what is next for $PLANT" width={600} height={315} />
          </Flex>
        </Flex>
      </PageHeader>
      <Page>
        <Heading as="h2" size="xl" mb="14px">Completed milestones</Heading>
        <Text>Presale of the $PLANT token on Bounce (April 2021)</Text>
        <Text>Initial liquidity for PLANT/BNB and the first PLANT/BNB and PLANT/BUSD farms and the PLANT garden (April 2021)</Text>
        <Text>Launch of the PlantSwap Development Fund — 45% of fees fund tree planting, 45% are burned, 10% kept in treasury</Text>
        <Text>First on-chain donations to the Rainforest Foundation (proof of impact)</Text>
        <Text>Release of the Barn dashboard — track yield-farming positions across multiple BSC DeFi projects in one place</Text>
        <Text>Collectibles and collectibles farms for NFT holders</Text>
        <Text>Community-driven proposals and on-chain voting on the Foundation</Text>
        <Text>Marketplace for peer-to-peer NFT trading</Text>
        <br />
        <Heading as="h2" size="xl" mb="14px">What is next for PlantSwap</Heading>
        <Text>Expand <a href="/farms">PlantSwap farms</a> with new BSC DeFi partnerships and cross-chain yield strategies</Text>
        <Text>Grow <a href="/gardens">PlantSwap gardens</a> with more single-token auto-compounding pools for $PLANT and partner tokens</Text>
        <Text>Deeper <a href="/foundation">Foundation</a> tooling — recurring donations, new environmental non-profits, and transparent proof-of-burn</Text>
        <Text>More $PLANT <a href="/pools">pools</a> and integration with trusted BSC DeFi partners</Text>
        <Text>Continued <a href="/documentation">documentation</a> and developer resources for the PlantSwap ecosystem</Text>
        <Text>Smart contract audits and security reviews for all new contracts</Text>
        <Text>Cross-chain compatibility — beyond BSC</Text>
        <Text>Expanded <a href="/market">NFT marketplace</a> features: auctions, offers, and partner collections</Text>
        <br />
        <Text>Have a feature request or want to contribute to the roadmap? Open a proposal in the <a href="/foundation">Foundation</a> or reach out on the <a href="/contact-us">contact page</a>.</Text>
        <br /><br />
        <Divider />
        <EndPage />
      </Page>
    </>
  )
}

export default Roadmap