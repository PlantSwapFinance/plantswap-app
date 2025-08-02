import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { useAccount } from 'wagmi'
import { Heading, Flex, Text, EndPage } from '@plantswap/uikit'
import orderBy from 'lodash/orderBy'
import partition from 'lodash/partition'
import { useTranslation } from 'contexts/Localization'
import usePersistState from 'hooks/usePersistState'
import { useFetchPubliVerticalGardensData, useVerticalGardens } from 'state/verticalGardens/hooks'
import { usePollFarmsData } from 'state/farms/hooks'
import { latinise } from 'utils/latinise'
import FlexLayout from 'components/Layout/Flex'
import Page from 'components/Layout/Page'
import PageHeader from 'components/PageHeader'
import SearchInput from 'components/SearchInput'
import Select, { OptionProps } from 'components/Select/Select'
import { VerticalGarden } from 'state/types'
import Loading from 'components/Loading'
import PoolCard from './components/VerticalGardenCard'
import PoolTabButtons from './components/VerticalGardenTabButtons'
import VerticalGardensTable from './components/VerticalGardensTable/VerticalGardensTable'
import { ViewMode } from './components/ToggleView/ToggleView'
// import { getAprData, getPlantVaultEarnings } from './helpers'

const CardLayout = styled(FlexLayout)`
  justify-content: center;
`

const PoolControls = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  position: relative;

  justify-content: space-between;
  flex-direction: column;
  margin-bottom: 32px;

  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
    flex-wrap: wrap;
    padding: 16px 32px;
    margin-bottom: 0;
  }
`

const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 8px 0px;

  ${({ theme }) => theme.mediaQueries.sm} {
    width: auto;
    padding: 0;
  }
`

const LabelWrapper = styled.div`
  > ${Text} {
    font-size: 12px;
  }
`

const ControlStretch = styled(Flex)`
  > div {
    flex: 1;
  }
`

const NUMBER_OF_POOLS_VISIBLE = 12

const Pools: React.FC = () => {
  const location = useLocation()
  const { t } = useTranslation()
  const { address: account } = useAccount()
  const { verticalGardens, userDataLoaded } = useVerticalGardens(account)
  const [stakedOnly, setStakedOnly] = usePersistState(false, { localStorageKey: 'plant_pool_staked' })
  const [numberOfPoolsVisible, setNumberOfPoolsVisible] = useState(NUMBER_OF_POOLS_VISIBLE)
  const [observerIsSet, setObserverIsSet] = useState(false)
  const loadMoreRef = useRef<HTMLDivElement>(null)
  const [viewMode, setViewMode] = usePersistState(ViewMode.TABLE, { localStorageKey: 'plant_pool_view' })
  const [searchQuery, setSearchQuery] = useState('')
  const [sortOption, setSortOption] = useState('hot')
  const chosenPoolsLength = useRef(0)

  // TODO aren't arrays in dep array checked just by reference, i.e. it will rerender every time reference changes?
  const [finishedPools, openPools] = useMemo(() => partition(verticalGardens, (verticalGarden) => verticalGarden.isFinished), [verticalGardens])
  const stakedOnlyFinishedPools = useMemo(
    () =>
      finishedPools.filter((verticalGarden) => {
        return verticalGarden.userData && new BigNumber(verticalGarden.userData.stakedBalance).isGreaterThan(0)
      }),
    [finishedPools],
  )
  const stakedOnlyOpenPools = useMemo(
    () =>
      openPools.filter((verticalGarden) => {
        return verticalGarden.userData && new BigNumber(verticalGarden.userData.stakedBalance).isGreaterThan(0)
      }),
    [openPools],
  )
  const hasStakeInFinishedPools = stakedOnlyFinishedPools.length > 0

  usePollFarmsData()
  useFetchPubliVerticalGardensData()

  useEffect(() => {
    const showMorePools = (entries) => {
      const [entry] = entries
      if (entry.isIntersecting) {
        setNumberOfPoolsVisible((poolsCurrentlyVisible) => {
          if (poolsCurrentlyVisible <= chosenPoolsLength.current) {
            return poolsCurrentlyVisible + NUMBER_OF_POOLS_VISIBLE
          }
          return poolsCurrentlyVisible
        })
      }
    }

    if (!observerIsSet) {
      const loadMoreObserver = new IntersectionObserver(showMorePools, {
        rootMargin: '0px',
        threshold: 1,
      })
      loadMoreObserver.observe(loadMoreRef.current)
      setObserverIsSet(true)
    }
  }, [observerIsSet])

  const showFinishedPools = location.pathname.includes('history')

  const handleChangeSearchQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value)
  }

  const handleSortOptionChange = (option: OptionProps): void => {
    setSortOption(option.value)
  }

  const sortPools = (poolsToSort: VerticalGarden[]) => {
    switch (sortOption) {
      case 'apr':
        // Ternary is needed to prevent verticalGardens without APR (like MIX) getting top spot
        return orderBy(
          poolsToSort,
          (verticalGarden: VerticalGarden) => (verticalGarden.apr ? 1 : 0),
          'desc',
        )
      case 'earned':
        return orderBy(
          poolsToSort,
          (verticalGarden: VerticalGarden) => {
            if (!verticalGarden.userData || !verticalGarden.stakingRewardTokenPrice) {
              return 0
            }
            return verticalGarden.isAutoVault
              ? 0
              : verticalGarden.userData.pendingReward.times(verticalGarden.stakingRewardTokenPrice).toNumber()
          },
          'desc',
        )
      case 'totalStaked':
        return orderBy(
          poolsToSort,
          (verticalGarden: VerticalGarden) => (verticalGarden.isAutoVault ? 0 : verticalGarden.totalStaked.toNumber()),
          'desc',
        )
      default:
        return poolsToSort
    }
  }

  let chosenPools
  if (showFinishedPools) {
    chosenPools = stakedOnly ? stakedOnlyFinishedPools : finishedPools
  } else {
    chosenPools = stakedOnly ? stakedOnlyOpenPools : openPools
  }

  if (searchQuery) {
    const lowercaseQuery = latinise(searchQuery.toLowerCase())
    chosenPools = chosenPools.filter((verticalGarden) =>
      latinise(verticalGarden.stakingRewardToken.symbol.toLowerCase()).includes(lowercaseQuery),
    )
  }

  chosenPools = sortPools(chosenPools).slice(0, numberOfPoolsVisible)
  chosenPoolsLength.current = chosenPools.length

  const cardLayout = (
    <CardLayout>
      {chosenPools.map((verticalGarden) => (
          <PoolCard key={verticalGarden.vgId} verticalGarden={verticalGarden} account={account} />
        ),
      )}
    </CardLayout>
  )

  const tableLayout = <VerticalGardensTable verticalGardens={chosenPools} account={account} userDataLoaded={userDataLoaded} />

  return (
    <>
    <PageHeader>
      <Flex justifyContent="space-between" flexDirection={['column', null, null, 'row']}>
        <Flex flex="1" flexDirection="column" mr={['8px', 0]}>
          <Heading as="h1" scale="xxl" color="secondary" mb="24px">
            {t('Vertical Gardens')}
          </Heading>
          <Heading scale="md" color="text">
            {t('Stake PLANT, LPs or other token and earn PLANT and other Token.')}<br />
            {t('You can unstake at any time.')}<br />
            {t('Rewards are calculated per block, some of it go')}<br />
            {t('toward buying PLANT token on the market and burning them')}<br />
            {t('and the remaining go toward the PlantSwap Development Fund')}
          </Heading>
        </Flex>
        <Flex flex="1" height="fit-content" justifyContent="center" alignItems="center" mt={['24px', null, '0']}>
          <img src="/images/verticalGardens.svg" alt="Gardens" width={600} height={315} />
        </Flex>
      </Flex>
    </PageHeader>

      <Page>
        <PoolControls>
          <PoolTabButtons
            stakedOnly={stakedOnly}
            setStakedOnly={setStakedOnly}
            hasStakeInFinishedPools={hasStakeInFinishedPools}
            viewMode={viewMode}
            setViewMode={setViewMode}
          />
          <FilterContainer>
            <LabelWrapper>
              <Text fontSize="12px" bold color="textSubtle" textTransform="uppercase">
                {t('Sort by')}
              </Text>
              <ControlStretch>
                <Select
                  options={[
                    {
                      label: t('Hot'),
                      value: 'hot',
                    },
                    {
                      label: t('APR'),
                      value: 'apr',
                    },
                    {
                      label: t('Earned'),
                      value: 'earned',
                    },
                    {
                      label: t('Total staked'),
                      value: 'totalStaked',
                    },
                  ]}
                  onChange={handleSortOptionChange}
                />
              </ControlStretch>
            </LabelWrapper>
            <LabelWrapper style={{ marginLeft: 16 }}>
              <Text fontSize="12px" bold color="textSubtle" textTransform="uppercase">
                {t('Search')}
              </Text>
              <SearchInput onChange={handleChangeSearchQuery} placeholder="Search Vertical Gardens" />
            </LabelWrapper>
          </FilterContainer>
        </PoolControls>
        {showFinishedPools && (
          <Text fontSize="20px" color="failure" pb="32px">
            {t('These verticalGardens are no longer distributing rewards. Please unstake your tokens.')}
          </Text>
        )}
        {account && !userDataLoaded && stakedOnly && (
          <Flex justifyContent="center" mb="4px">
            <Loading />
          </Flex>
        )}
        {viewMode === ViewMode.CARD ? cardLayout : tableLayout}
        <div ref={loadMoreRef} />
      <EndPage />
      </Page>
    </>
  )
}

export default Pools
