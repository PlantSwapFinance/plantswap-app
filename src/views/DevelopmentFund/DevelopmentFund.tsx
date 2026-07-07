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
              {t('Find the details on the PlantSwap Development Fund')}<br />
              {t('The contribution to non-profits and proof of burn')}
            </Heading>
          </Flex>
          <Flex flex="1" height="fit-content" justifyContent="center" alignItems="center" mt={['24px', null, '0']}>
            <img src="/images/developmentFund.svg" alt="PlantSwap Development Fund — proof of burn and donations to environmental non-profits" width={600} height={315} />
          </Flex>
        </Flex>
      </PageHeader>
      <MasterGardener />
      <Page>
        <Heading as="h2" size="xl" mb="14px">What is the PlantSwap Development Fund?</Heading>
        <br />
        <Text>The PlantSwap Development Fund is the on-chain treasury that turns a share of every yield-farming fee on the <a href="/farms">PlantSwap farms</a> and <a href="/gardens">gardens</a> into real-world environmental impact.</Text>
        <Text>Every time users harvest $PLANT from a farm or garden, a portion of the rewards is redirected to the Development Fund. The community then votes — through the <a href="/foundation">PlantSwap Foundation</a> — on which environmental non-profits the fund should support.</Text>
        <br />
        <Heading as="h2" size="xl" mb="14px">How fees are split</Heading>
        <br />
        <Text>45% 🌲 will go to plant trees 🌲</Text>
        <Text>45% 🔥 will be burned to lower the total supply 🔥</Text>
        <Text>10% 💸 kept in treasury to cover operating expense 💸</Text>
        <br />
        <Heading as="h2" size="xl" mb="14px">Current non-profits supported by the Development Fund</Heading>
        <br />
        <Heading as="h3" size="lg" mb="16px">The Rainforest Foundation</Heading>
        <Text>The Rainforest Foundation is a charitable foundation founded in 1987 and dedicated to drawing attention to rainforests and defending the rights of indigenous peoples living there.</Text>
        <br />
        <Heading as="h2" size="xl" mb="14px">Frequency and proof on-chain</Heading>
        <br />
        <Text>Donations are sent on a recurring basis as the fund grows and more non-profits are added to the roster. Every donation transaction is published below and on-chain so anyone can independently verify the impact.</Text>
        <br />
        <Heading as="h2" size="xl" mb="14px">Last donations</Heading>
        <Donation>
          <br />
          <ul>
            <li>250$ - Rainforest Foundation (https://etherscan.io/tx/0xdcda28b246ba81a9068a9db599f41bccc90f17b65799eb8c5835b3a8cc631ee0)</li>
            <li>4200$ - Rainforest Foundation (https://etherscan.io/tx/0xdbeac34c17995294466e4248e31db05f646e79980c1ebfad8034a198cd151c79)</li>
            <li>6000$ - Rainforest Foundation (https://etherscan.io/tx/0xd40c9d84e75c3169aeb5cb6831782ed4438216932e172720a54804fbf0f73f9b)</li>
            <li>50$ - Rainforest Foundation (https://etherscan.io/tx/0x967c5ad8c523406f0515dc7a98faaf942946008531c3a066ca9aec6146b3d56f)</li>
          </ul>
          <br />
          <Text>Thank you for your support!</Text>
        </Donation>
        <Divider />
        <Text>Want to suggest a non-profit or vote on the next donation? Open a proposal in the <a href="/foundation">PlantSwap Foundation</a>.</Text>
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