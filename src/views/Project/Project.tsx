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
            <img src="/images/project.svg" alt="Gardens" width={600} height={315} />
          </Flex>
        </Flex>
      </PageHeader>
      <Page>
          <Heading as="h2" size="xl" mb="14px">Are you farming on Binance Smart Chain yet?</Heading>
            <br />
            <Text>Did you hear of the success of PlantSwap, GooseFinance, CafeSwap and many more?</Text>
            <Text>The DeFi space has been growing at an insane speed and if you are a seasoned farmer by now, you must be having like us, you probably must have multiple dozens of tabs open on your browser to keep track of your different farms and pools.</Text>
            <Text>Even just keeping track of the price of all of these DeFi projects probably give you headaches!</Text>
            <Text>This is where PlantSwap come in, we are launching a farming platform that aims at giving you tools to track many metrics across multiple BSC farming projects!</Text>
            <br />
          <Heading as="h2" size="xl" mb="14px">What DeFi problems are we trying to solve?:</Heading>
            <br />
            <Text>Too many different websites and platforms to look at to manage your diverse farming investments, we give you the tools to have a quick glance at all your farming operations across multiple other DeFi projects on Binance Smart Chain all in one tab.</Text>
            <Text>The difficulty of keeping track of the price per token of many DeFi project</Text>
            <Text>Extremely hard to know your impermanent gaind/lossed on Binance Smart Chain</Text>
            <Text>Too many rugpulls with the use of a Migrator contract</Text>
            <br />
          <Heading as="h2" size="xl" mb="14px">What will we do about these?:</Heading>
            <br />
            <Text>No migrator contract, no chance of rugpulls here!</Text>
            <Text>Detect what other pools and farms you are taking part in and allow you to see your rewards across multiples DeFi projects.</Text>
            <Text>Calculate the profitability per day/month/year of each of your farming strategies and allow you to calculate the profitability at different price valuation.</Text>
            <Text>Allow you to remove spending approval, emergency withdraw and other security functions aiming at protecting you from others DeFi projects going bad.</Text>
            <Text>Set automatic harvest or compound functions on other farms and pool.</Text>
            <br />
          <Heading as="h2" size="xl" mb="14px">🌲The PlantSwap Development Fund will help plant trees and other environmental causes</Heading>
            <br />
            <Text>45%🌲 will go to plant trees 🌲</Text>
            <Text>45%🔥 will be burned to lower the total supply 🔥</Text>
            <Text>10%💸 will be kept in treasury to cover operating expense 💸</Text>
            <br />
            <Text>A governance token to choose the right organizations and causes to support</Text>
            <Text>Later this year, when the community around Plant Swap finance will have grown, we will release a governance token to decentralize the decision making on which causes to support, what goal to focus on and regulate the different economic incentives of this eco-system. More on this later…</Text>
          <br /><br />
        <Divider />
        <EndPage />
      </Page>
    </>
  )
}

export default Project
