import React, { useEffect, useState } from 'react'
import { Card, Heading, Image, Text, Box, Flex, IconButton, ArrowForwardIcon, Link } from '@plantswap/uikit'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { getFoundationNonProfitAddress } from 'utils/addressHelpers'
import { useTeams } from 'state/teams/hooks'
import multicall from 'utils/multicall'
import BigNumber from 'bignumber.js'
import plantswapFoundationNonProfitAbi from 'config/abi/plantswapFoundationNonProfit.json'
import Container from 'components/Layout/Container'
// import { useGetProposalLoadingStatus, useGetProposals } from 'state/foundation/hooks'
import { ProposalState, ProposalType } from 'state/types'
import TabMenu from './TabMenu'
// import ProposalRow from './ProposalRow'
import Filters from './Filters'

interface State {
  proposalType: ProposalType
  filterState: ProposalState
}

interface FoundationRow {
  name: string
  donationAddress: string
  teamId: number
  logoUrl: string
}

/* interface ListState {
  id: number
  data: FoundationRow[]
} */

const StyledProposalRow = styled(Link)`
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.colors.cardBorder};
  display: flex;
  padding: 16px 24px;
  width: 100%;

  &:hover {
    background-color: ${({ theme }) => theme.colors.dropdown};
  }
`

const Proposals = () => {
  const { t } = useTranslation()
  const { teams } = useTeams()

  const [lastId, setLastId] = useState(0)

  const [list, setList] = useState<FoundationRow>({
    name: 'hello',
    donationAddress: '',
    teamId: 1,
    logoUrl: 'https://',
  })

  const [state, setState] = useState<State>({
    proposalType: ProposalType.CORE,
    filterState: ProposalState.ACTIVE,
  })
  const { proposalType, filterState } = state

  useEffect(() => {
    const fetchFoundationGeneral = async (setLastIdState) => {
      const calls = [
        {
          address: getFoundationNonProfitAddress(),
          name: 'getLastProposalId',
        },
      ]
      const [lastProposalId] = await multicall(plantswapFoundationNonProfitAbi, calls)
    
      setLastIdState(new BigNumber(lastProposalId).toJSON())
      
      return {
        lastProposalId: new BigNumber(lastProposalId).toJSON(),
      }
    }
      fetchFoundationGeneral(setLastId)

  }, [setLastId])

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
    fetchFoundationList(lastId, setList)

  }, [setList, lastId])

  const handleProposalTypeChange = (newProposalType: ProposalType) => {
    setState((prevState) => ({
      ...prevState,
      proposalType: newProposalType,
    }))
  }

  const handleFilterChange = (newFilterState: ProposalState) => {
    setState((prevState) => ({
      ...prevState,
      filterState: newFilterState,
    }))
  }

  const votingLink = `/foundation/proposal/${lastId}`

  return (
    <Container>
      <Heading as="h2" scale="xl" mb="32px">
        {t('List of Ecological non-profit')}
      </Heading>
      <Text>{t('Here is the list of ecological non-profit foundation that Plantswap members submitted for proposals. You can vote on recent proposal, help validate the authenticity of a listing, donate directly to them and consult details on previous donnations to each of these foundations.')}</Text>
      <br />
      <Card>
        <TabMenu proposalType={proposalType} onTypeChange={handleProposalTypeChange} />
        <Filters filterState={filterState} onFilterChange={handleFilterChange} /> {/*  isLoading={isLoading} */}
        {/* isLoading && <ProposalsLoading /> */}
        {lastId > 0 && (
          <>
          <StyledProposalRow>
            <Link href={votingLink}>
              <Box as="span" style={{ width: "100%" }}>
                <Flex alignItems="left" mb="8px">
                  <Image src={list.logoUrl} width={42} height={42} />
                  <Text bold mb="8px">
                    {list.name}
                  </Text>
                  <Flex alignItems="right">
                    <Text>
                      <Image src={`/images/teams/${teams[list.teamId].images.md} `} width={32} height={32} />
                      {teams[list.teamId].name}
                    </Text>
                  </Flex>
                </Flex>
              </Box>
              <IconButton variant="text">
                <ArrowForwardIcon width="24px" />
              </IconButton>
            </Link>
          </StyledProposalRow>
          </>
        )}
      </Card>
    </Container>
  )
}

export default Proposals
