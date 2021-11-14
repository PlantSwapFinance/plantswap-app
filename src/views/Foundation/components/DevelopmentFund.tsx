import React from 'react'
import styled from 'styled-components'
import { Flex, Text, Heading } from '@plantswap/uikit'

const Grid = styled.div`
  display: grid;
  grid-gap: 8px;
  margin-top: 24px;
  grid-template-columns: repeat(2, auto);

  ${({ theme }) => theme.mediaQueries.sm} {
    grid-gap: 16px;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    grid-gap: 32px;
    grid-template-columns: repeat(4, auto);
  }
`

const DevelopmentFund = () => {

  return (
    <Grid>
      <Flex flexDirection="column">
      <Heading as="h2" size="xl" mb="16px">🌲The PlantSwap Development Fund will help plant trees and other environmental causes</Heading>
          <br />
          <Text>Some pools will have deposit fees as well as some of the transactions with the Master Gardener smart contract results in PLANT being created and sent to the Development Fund address. What will we do with the fund?</Text>
          <br />
          <Text>45%🌲 will go to plant trees 🌲</Text>
          <Text>45%🔥 will be burned to lower the total supply 🔥</Text>
          <Text>10%💸 will be kept in treasury to cover operating expenses 💸</Text>
          <br />
          <Text>A governance token to choose the right organizations and causes to support</Text>
          <Text>Later this year, when the community around Plant Swap finance will have grown, we will release a governance token to decentralize the decision making on which causes to support, what goals to focus on and regulate the different economic incentives of this eco-system. More on this later…</Text>
        <br /><br />
        </Flex>
    </Grid>
  )
}

export default DevelopmentFund
