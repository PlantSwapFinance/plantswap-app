import React from 'react'
import Page from 'components/Layout/Page'
import PageHeader from 'components/PageHeader'
import { Heading, Text, Flex, EndPage } from '@plantswap/uikit'
import { useTranslation } from 'contexts/Localization'
import Divider from './components/Divider'

const Project = () => {
  const { t } = useTranslation()

  return (
    <>
      <PageHeader>
        <Flex justifyContent="space-between" flexDirection={['column', null, null, 'row']}>
          <Flex flex="1" flexDirection="column" mr={['8px', 0]}>
            <Heading as="h1" scale="xxl" color="secondary" mb="24px">
              {t('Project')}
            </Heading>
            <Heading scale="lg" color="text">
              {t('Read the detail of our project and')}<br />
              {t('The PlantSwap Development Fund')}
            </Heading>
          </Flex>
          <Flex flex="1" height="fit-content" justifyContent="center" alignItems="center" mt={['24px', null, '0']}>
            <img src="/images/project.svg" alt="PlantSwap project — DeFi that funds tree planting and rainforest protection" width={600} height={315} />
          </Flex>
        </Flex>
      </PageHeader>
      <Page>
        <Heading as="h2" size="xl" mb="14px">PlantSwap — DeFi on Binance Smart Chain that helps the planet</Heading>
        <br />
        <Text>PlantSwap is a yield-farming and AMM platform on Binance Smart Chain (BSC) where users earn the $PLANT token through farms and gardens, and where a share of every transaction funds real-world environmental causes.</Text>
        <Text>DeFi on BSC is growing fast, but most platforms look the same — the same farms, the same tokenomics, the same dashboards. PlantSwap is built to be different: every swap, every farm, every garden puts the planet first.</Text>
        <br />
        <Heading as="h2" size="xl" mb="14px">What problems does PlantSwap solve?</Heading>
        <br />
        <Text>Too many BSC DeFi platforms to track — farms, pools, and token prices are scattered across dozens of tabs. PlantSwap brings them together.</Text>
        <Text>Hard to know your real yield — fee tier, APR, impermanent gain and loss are usually invisible. PlantSwap makes them clear.</Text>
        <Text>Rug pulls from migrator contracts — PlantSwap has no migrator code, so LP tokens cannot be pulled out from under you.</Text>
        <Text>DeFi without a mission — PlantSwap donates part of every transaction to environmental non-profits through the Development Fund.</Text>
        <br />
        <Heading as="h2" size="xl" mb="14px">How PlantSwap solves them</Heading>
        <br />
        <Text>No migrator contract — your liquidity stays where you put it.</Text>
        <Text>Detect your other farms and pools across BSC and see your rewards in one place on the <a href="/farms">PlantSwap farms</a> page.</Text>
        <Text>Clear APR and profitability calculations per day, month, and year — across multiple price scenarios.</Text>
        <Text>One-click controls to revoke spending approvals and emergency-withdraw from other BSC DeFi projects if something goes wrong.</Text>
        <Text>Auto-compound and auto-harvest support on partner farms and pools.</Text>
        <Text>Stake single tokens in <a href="/gardens">PlantSwap gardens</a> for hands-off, auto-compounding yield in $PLANT.</Text>
        <Text>Trade any BEP-20 token with low slippage on the <a href="/swap">PlantSwap swap</a>.</Text>
        <br />
        <Heading as="h2" size="xl" mb="14px">🌲 The PlantSwap Development Fund</Heading>
        <br />
        <Text>45% 🌲 will go to plant trees 🌲</Text>
        <Text>45% 🔥 will be burned to lower the total supply 🔥</Text>
        <Text>10% 💸 will be kept in treasury to cover operating expense 💸</Text>
        <br />
        <Text>The Development Fund is governed by the community. Holders of $PLANT can vote on which non-profits to support through the <a href="/foundation">Foundation</a>.</Text>
        <Text>Every donation is published on-chain — see the full list on the <a href="/developmentFund">Development Fund</a> page.</Text>
        <Text>Read more about upcoming milestones on the <a href="/roadmap">PlantSwap roadmap</a>.</Text>
        <br /><br />
        <Divider />
        <EndPage />
      </Page>
    </>
  )
}

export default Project