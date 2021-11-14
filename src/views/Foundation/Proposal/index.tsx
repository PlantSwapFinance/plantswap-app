import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowBackIcon, Box, Button, Flex, Heading, Image, Text } from '@plantswap/uikit'
import { useTranslation } from 'contexts/Localization'
import multicall from 'utils/multicall'
import { useTeams } from 'state/teams/hooks'
import { getFoundationNonProfitAddress } from 'utils/addressHelpers'
import BigNumber from 'bignumber.js'
import plantswapFoundationNonProfitAbi from 'config/abi/plantswapFoundationNonProfit.json'
import Container from 'components/Layout/Container'
// import ReactMarkdown from 'components/ReactMarkdown'
import { ProposalTypeTag } from '../components/Proposals/tags'
import Layout from '../components/Layout'

interface FoundationRow {
  name: string
  donationAddress: string
  teamId: number
  logoUrl: string
}

const Proposal = () => {
  const { id }: { id: string } = useParams()
  const { t } = useTranslation()
  const { teams } = useTeams()
  const [list, setList] = useState<FoundationRow>({
    name: 'PlantSwap.finance Development Fund',
    donationAddress: '',
    teamId: 1,
    logoUrl: 'https://plantswap.finance/logo.png',
  })

  useEffect(() => {
    const fetchFoundationList = async (refIdFoundation, setListState) => {
      const call2s = [
        {
          address: getFoundationNonProfitAddress(),
          name: 'getProposalDetail',
          params: [1],
        },
      ]
    
      const [proposalDetail] = await multicall(plantswapFoundationNonProfitAbi, call2s)
    
      const parsedProposalDetail = proposalDetail.map((detail) => {
        return new BigNumber(detail[0]).toJSON()
      })
      setListState({
        name: proposalDetail[1],
        donationAddress: proposalDetail[2],
        teamId: proposalDetail[4],
        logoUrl: proposalDetail[3],
      })
      return parsedProposalDetail
    }

    fetchFoundationList(id, setList)
  }, [setList, id])
  
  return (
    <Container py="40px">
      <Box mb="40px">
        <Button as={Link} to="/foundation" variant="text" startIcon={<ArrowBackIcon color="primary" width="24px" />} px="0">
          {t('Back to Foundation Overview')}
        </Button>
      </Box>
      <Layout>
        <Box>
          <Box mb="32px">
            <Flex alignItems="center" mb="8px">
              <ProposalTypeTag isCoreProposal={false} ml="8px" />
            </Flex>
            <Heading as="h1" scale="xl" mb="16px">
              <Image src={list.logoUrl} alt={list.name} width={80} height={80} />
              {list.name}
            </Heading>
            <Box>
              {/* <ReactMarkdown>Hello World</ReactMarkdown> */}
            {parseInt(id, 10) === 1 && (
              <>
                <Heading>🌲The PlantSwap Development Fund will help plant trees and other environmental causes</Heading>
                <br />
                <Text>45%🌲 will go to plant trees 🌲</Text>
                <Text>45%🔥 will be burn to lower the total supply 🔥</Text>
                <Text>10%💸 keep in treasury to cover operating expense 💸</Text>
              </>
            )}
            </Box>
          </Box>
          
        </Box>
        <Box>
          <Text bold>Team</Text>
          <Image src={`/images/teams/${teams[list.teamId].images.md} `} alt={teams[list.teamId].name} width={60} height={60} />
          <Text>{teams[list.teamId].name}</Text>
        </Box>
      </Layout>
    </Container>
  )
}

export default Proposal
