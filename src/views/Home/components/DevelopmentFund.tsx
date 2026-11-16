import React from 'react'
import styled from 'styled-components'
import { Link as RouterLink } from 'react-router-dom'
import { Flex, Text, Heading, Link } from '@plantswap/uikit'

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

const AllocationList = styled.ul`
  list-style: none;
  margin: 0 0 24px;
  padding: 0;
`

const DevelopmentFund = () => {
  return (
    <Grid>
      <Flex flexDirection="column" mb="32px">
        <Heading as="h2" size="xl" mb="32px">
          The PlantSwap Development Fund will help plant trees and other environmental causes
        </Heading>
        <Text mb="24px">
          Some pools will have deposit fees as well as some of the transactions with the Master Gardener smart contract
          results in PLANT being created and sent to the Development Fund address. What will we do with the fund?
        </Text>
        <AllocationList>
          <Text as="li">45%🌲 will go to plant trees 🌲</Text>
          <Text as="li">45%🔥 will be burned to lower the total supply 🔥</Text>
          <Text as="li">10%💸 will be kept in treasury to cover operating expenses 💸</Text>
        </AllocationList>
        <Text>Community governance chooses the organizations and causes to support</Text>
        <Text>
          PlantSwap governance is live on Snapshot. PLANT holders vote on which causes to support, what goals to focus
          on, and how the economic incentives of this ecosystem are set.
        </Text>
        <Link as={RouterLink} to="/voting" mt="8px">
          Vote on proposals
        </Link>
      </Flex>
    </Grid>
  )
}

export default DevelopmentFund
