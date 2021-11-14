import React from 'react'
import Page from 'components/Layout/Page'
import PageHeader from 'components/PageHeader'
import { Heading, Text, Flex, EndPage } from '@plantswap/uikit'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import Divider from './components/Divider'
import MasterGardener from './MasterGardener'

const DevelopmentFund = () => {
  const { t } = useTranslation()

  return (
    <>
      <PageHeader>
        <Flex justifyContent="space-between" flexDirection={['column', null, null, 'row']}>
          <Flex flex="1" flexDirection="column" mr={['8px', 0]}>
            <Heading as="h1" scale="xxl" color="secondary" mb="24px">
              {t('Development Fund')}
            </Heading>
            <Heading scale="lg" color="text">
              {t('Find the details on the PlantSwap Development Fun')}<br />
              {t('The contribution to non-profits and proof of burn')}
            </Heading>
          </Flex>
          <Flex flex="1" height="fit-content" justifyContent="center" alignItems="center" mt={['24px', null, '0']}>
            <img src="/images/developmentFund.svg" alt="Gardens" width={600} height={315} />
          </Flex>
        </Flex>
      </PageHeader>
      <MasterGardener />
      <Page>
          <Heading as="h2" size="xl" mb="14px">Current non-profits selected by the Development Fund</Heading>
            <br />
            <Heading as="h1" size="xxl" mb="16px">The Rainforest foundation</Heading>
            <Text>The Rainforest Foundation Fund is a charitable foundation founded in 1987 and dedicated to drawing attention to rainforests and defending the rights of indigenous peoples living there.</Text>
            <br />
            <br />
          <Heading as="h2" size="xl" mb="14px">The frequency of the donnation and blockchain proof</Heading>
            <br />
            <Text>We are planning the first donation on the first week of May and we will increase the frequency as the ammount increase and we find more foundation to distribure these donations.</Text>
            <br />
            <br />
          <Heading as="h2" size="xl" mb="14px">🌲The PlantSwap Development Fund will help plant trees and other environmental causes</Heading>
            <br />
            <Text>45%🌲 will go to plant trees 🌲</Text>
            <Text>45%🔥 will be burn to lower the total supply 🔥</Text>
            <Text>10%💸 keep in treasury to cover operating expense 💸</Text>
            <br />
        <Divider />
        <Heading as="h2" size="xl" mb="14px">Last donations</Heading>
        <Donation>
            <br />
            <ul>
              <li>250$ - Raingorest Foundation (https://etherscan.io/tx/0xdcda28b246ba81a9068a9db599f41bccc90f17b65799eb8c5835b3a8cc631ee0)</li>
              <li>4200$ - Raingorest Foundation (https://etherscan.io/tx/0xdbeac34c17995294466e4248e31db05f646e79980c1ebfad8034a198cd151c79)</li>
              <li>6000$ - Raingorest Foundation (https://etherscan.io/tx/0xd40c9d84e75c3169aeb5cb6831782ed4438216932e172720a54804fbf0f73f9b)</li>
              <li>50$ - Raingorest Foundation (https://etherscan.io/tx/0x967c5ad8c523406f0515dc7a98faaf942946008531c3a066ca9aec6146b3d56f)</li>
            </ul>
            <br />
            <Text>Thank you for your support!</Text>
        </Donation>
        <Divider />
        <EndPage />
      </Page>
    </>
  )
}

const Donation = styled.div`
  align-items: center;
  color: ${({ theme }) => theme.colors.primary};
  ul {
    margin: 0;
    padding: 0;
    list-style-type: none;
    font-size: 16px;
    li {
      margin-bottom: 4px;
    }
  }
`

export default DevelopmentFund
