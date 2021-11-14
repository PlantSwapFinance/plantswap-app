import React, { useEffect, useCallback, useState, useMemo, useRef } from 'react'
import { Route, useRouteMatch, useLocation, NavLink } from 'react-router-dom'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import { Heading, RowType, Toggle, Text, Button, ArrowForwardIcon, Flex, EndPage } from '@plantswap/uikit'
import { ChainId } from '@pancakeswap/sdk'
import styled from 'styled-components'
import FlexLayout from 'components/Layout/Flex'
import Page from 'components/Layout/Page'
import { useFarms, usePollFarmsData, usePricePlantBusd, usePriceCakeBusd } from 'state/farms/hooks'
import usePersistState from 'hooks/usePersistState'
import { Farm } from 'state/types'
import { useTranslation } from 'contexts/Localization'
import { getBalanceNumber } from 'utils/formatBalance'
import { getFarmApr } from 'utils/apr'
import { orderBy } from 'lodash'
import isArchivedPid from 'utils/farmHelpers'
import { latinise } from 'utils/latinise'
import PageHeader from 'components/PageHeader'
import SearchInput from 'components/SearchInput'
import Select, { OptionProps } from 'components/Select/Select'
import Loading from 'components/Loading'
import GardenCard, { GardenWithStakedValue } from './components/GardenCard/GardenCard'
import Table from './components/GardenTable/GardenTable'
import GardenTabButtons from './components/GardenTabButtons'
import { RowProps } from './components/GardenTable/Row'
import ToggleView from './components/ToggleView/ToggleView'
import { DesktopColumnSchema, ViewMode } from './components/types'

export interface GardensProps{
  tokenMode?: boolean
}

const ControlContainer = styled.div`
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

const ToggleWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-left: 10px;

  ${Text} {
    margin-left: 8px;
  }
`

const LabelWrapper = styled.div`
  > ${Text} {
    font-size: 12px;
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

const ViewControls = styled.div`
  flex-wrap: wrap;
  justify-content: space-between;
  display: flex;
  align-items: center;
  width: 100%;

  > div {
    padding: 8px 0px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    justify-content: flex-start;
    width: auto;

    > div {
      padding: 0;
    }
  }
`

const NUMBER_OF_FARMS_VISIBLE = 12

const getDisplayApr = (plantRewardsApr?: number, lpRewardsApr?: number) => {
  if (plantRewardsApr && lpRewardsApr) {
    return (plantRewardsApr + lpRewardsApr).toLocaleString('en-US', { maximumFractionDigits: 2 })
  }
  if (plantRewardsApr) {
    return plantRewardsApr.toLocaleString('en-US', { maximumFractionDigits: 2 })
  }
  return null
}

const Gardens: React.FC<GardensProps> = (gardensProps) => {
  const { path } = useRouteMatch()
  const { pathname } = useLocation()
  const { t } = useTranslation()
  const { data: gardensLP, userDataLoaded } = useFarms()
  const plantPrice = usePricePlantBusd()
  const priceCake = usePriceCakeBusd()
  const [query, setQuery] = useState('')
  const [viewMode, setViewMode] = usePersistState(ViewMode.TABLE, { localStorageKey: 'plant_garden_view' })
  const { account } = useWeb3React()
  const [sortOption, setSortOption] = useState('hot')
  const chosenGardensLength = useRef(0)
  const {tokenMode} = gardensProps;

  const isArchived = pathname.includes('archived')
  const isInactive = pathname.includes('history')
  const isActive = !isInactive && !isArchived

  usePollFarmsData(isArchived)

  // Users with no wallet connected should see 0 as Earned amount
  // Connected users should see loading indicator until first userData has loaded
  const userDataReady = !account || (!!account && userDataLoaded)

  const [stakedOnly, setStakedOnly] = useState(!isActive)
  useEffect(() => {
    setStakedOnly(!isActive)
  }, [isActive])

  const activeGardens = gardensLP.filter((garden) =>  !!garden.isTokenOnly === !!tokenMode && garden.multiplier !== '0X' && !isArchivedPid(garden.pid))
  const inactiveGardens = gardensLP.filter((garden) =>  !!garden.isTokenOnly === !!tokenMode && garden.multiplier === '0X' && !isArchivedPid(garden.pid))
  const archivedGardens = gardensLP.filter((garden) =>  !!garden.isTokenOnly === !!tokenMode && isArchivedPid(garden.pid))

  const stakedOnlyGardens = activeGardens.filter(
    (garden) => garden.userData && new BigNumber(garden.userData.stakedBalance).isGreaterThan(0),
  )

  const stakedInactiveGardens = inactiveGardens.filter(
    (garden) => garden.userData && new BigNumber(garden.userData.stakedBalance).isGreaterThan(0),
  )

  const stakedArchivedGardens = archivedGardens.filter(
    (garden) => garden.userData && new BigNumber(garden.userData.stakedBalance).isGreaterThan(0),
  )

  const gardensList = useCallback(
    (gardensToDisplay: Farm[]): GardenWithStakedValue[] => {
      let gardensToDisplayWithAPR: GardenWithStakedValue[] = gardensToDisplay.map((garden) => {
       // if (!garden.lpTotalInQuoteToken || !garden.quoteToken.busdPrice) {
       //   return garden
       // }
      
      let totalLiquidity = new BigNumber(garden.lpTotalInQuoteToken).times(garden.quoteToken.busdPrice)
      if(priceCake && garden.lpSymbol === 'CAKE') {
        totalLiquidity = new BigNumber(garden.lpTotalInQuoteToken).times(priceCake)
      }
        const { plantRewardsApr, lpRewardsApr } = isActive
          ? getFarmApr(new BigNumber(garden.poolWeight), plantPrice, totalLiquidity, garden.lpAddresses[ChainId.MAINNET])
          : { plantRewardsApr: 0, lpRewardsApr: 0 }

        return { ...garden, apr: plantRewardsApr, lpRewardsApr, liquidity: totalLiquidity }
      })

      if (query) {
        const lowercaseQuery = latinise(query.toLowerCase())
        gardensToDisplayWithAPR = gardensToDisplayWithAPR.filter((garden: GardenWithStakedValue) => {
          return latinise(garden.lpSymbol.toLowerCase()).includes(lowercaseQuery)
        })
      }
      return gardensToDisplayWithAPR
    },
    [plantPrice, priceCake, query, isActive],
  )

  const handleChangeQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value)
  }

  const loadMoreRef = useRef<HTMLDivElement>(null)

  const [numberOfGardensVisible, setNumberOfGardensVisible] = useState(NUMBER_OF_FARMS_VISIBLE)
  const [observerIsSet, setObserverIsSet] = useState(false)

  const chosenGardensMemoized = useMemo(() => {
    let chosenGardens = []

    const sortGardens = (gardens: GardenWithStakedValue[]): GardenWithStakedValue[] => {
      switch (sortOption) {
        case 'apr':
          return orderBy(gardens, (garden: GardenWithStakedValue) => garden.apr + garden.lpRewardsApr, 'desc')
        case 'multiplier':
          return orderBy(
            gardens,
            (garden: GardenWithStakedValue) => (garden.multiplier ? Number(garden.multiplier.slice(0, -1)) : 0),
            'desc',
          )
        case 'earned':
          return orderBy(
            gardens,
            (garden: GardenWithStakedValue) => (garden.userData ? Number(garden.userData.earnings) : 0),
            'desc',
          )
        case 'liquidity':
          return orderBy(gardens, (garden: GardenWithStakedValue) => Number(garden.liquidity), 'desc')
        default:
          return gardens
      }
    }

    if (isActive) {
      chosenGardens = stakedOnly ? gardensList(stakedOnlyGardens) : gardensList(activeGardens)
    }
    if (isInactive) {
      chosenGardens = stakedOnly ? gardensList(stakedInactiveGardens) : gardensList(inactiveGardens)
    }
    if (isArchived) {
      chosenGardens = stakedOnly ? gardensList(stakedArchivedGardens) : gardensList(archivedGardens)
    }

    return sortGardens(chosenGardens).slice(0, numberOfGardensVisible)
  }, [
    sortOption,
    activeGardens,
    gardensList,
    inactiveGardens,
    archivedGardens,
    isActive,
    isInactive,
    isArchived,
    stakedArchivedGardens,
    stakedInactiveGardens,
    stakedOnly,
    stakedOnlyGardens,
    numberOfGardensVisible,
  ])

  chosenGardensLength.current = chosenGardensMemoized.length

  useEffect(() => {
    const showMoreGardens = (entries) => {
      const [entry] = entries
      if (entry.isIntersecting) {
        setNumberOfGardensVisible((gardensCurrentlyVisible) => {
          if (gardensCurrentlyVisible <= chosenGardensLength.current) {
            return gardensCurrentlyVisible + NUMBER_OF_FARMS_VISIBLE
          }
          return gardensCurrentlyVisible
        })
      }
    }

    if (!observerIsSet) {
      const loadMoreObserver = new IntersectionObserver(showMoreGardens, {
        rootMargin: '0px',
        threshold: 1,
      })
      loadMoreObserver.observe(loadMoreRef.current)
      setObserverIsSet(true)
    }
  }, [chosenGardensMemoized, observerIsSet])

  const rowData = chosenGardensMemoized.map((garden) => {
    const { token, quoteToken } = garden
    const tokenAddress = token.address
    const quoteTokenAddress = quoteToken.address
    const lpLabel = garden.lpSymbol && garden.lpSymbol.split(' ')[0].toUpperCase()

    const row: RowProps = {
      apr: {
        value: getDisplayApr(garden.apr, garden.lpRewardsApr),
        multiplier: garden.multiplier,
        lpLabel,
        tokenAddress,
        quoteTokenAddress,
        plantPrice,
        originalValue: garden.apr,
      },
      garden: {
        label: lpLabel,
        pid: garden.pid,
        token: garden.token,
        rewardToken: garden.rewardToken,
      },
      earned: {
        earnings: getBalanceNumber(new BigNumber(garden.userData.earnings)),
        pid: garden.pid,
      },
      liquidity: {
        liquidity: garden.liquidity,
      },
      multiplier: {
        multiplier: garden.multiplier,
      },
      details: garden,
    }

    return row
  })

  const renderContent = (): JSX.Element => {
    if (viewMode === ViewMode.TABLE && rowData.length) {
      const columnSchema = DesktopColumnSchema

      const columns = columnSchema.map((column) => ({
        id: column.id,
        name: column.name,
        label: column.label,
        sort: (a: RowType<RowProps>, b: RowType<RowProps>) => {
          switch (column.name) {
            case 'garden':
              return b.id - a.id
            case 'apr':
              if (a.original.apr.value && b.original.apr.value) {
                return Number(a.original.apr.value) - Number(b.original.apr.value)
              }

              return 0
            case 'earned':
              return a.original.earned.earnings - b.original.earned.earnings
            default:
              return 1
          }
        },
        sortable: column.sortable,
      }))

      return <Table data={rowData} columns={columns} userDataReady={userDataReady} />
    }

    return (
      <FlexLayout>
        <Route exact path={`${path}`}>
          {chosenGardensMemoized.map((garden) => (
            <GardenCard
              key={garden.pid}
              garden={garden}
              displayApr={getDisplayApr(garden.apr, garden.lpRewardsApr)}
              plantPrice={plantPrice}
              account={account}
              removed={false}
            />
          ))}
        </Route>
        <Route exact path={`${path}/history`}>
          {chosenGardensMemoized.map((garden) => (
            <GardenCard
              key={garden.pid}
              garden={garden}
              displayApr={getDisplayApr(garden.apr, garden.lpRewardsApr)}
              plantPrice={plantPrice}
              account={account}
              removed
            />
          ))}
        </Route>
        <Route exact path={`${path}/archived`}>
          {chosenGardensMemoized.map((garden) => (
            <GardenCard
              key={garden.pid}
              garden={garden}
              displayApr={getDisplayApr(garden.apr, garden.lpRewardsApr)}
              plantPrice={plantPrice}
              account={account}
              removed
            />
          ))}
        </Route>
      </FlexLayout>
    )
  }

  const handleSortOptionChange = (option: OptionProps): void => {
    setSortOption(option.value)
  }

  return (
    <>
      <PageHeader>
        <Flex justifyContent="space-between" flexDirection={['column', null, null, 'row']}>
          <Flex flex="1" flexDirection="column" mr={['8px', 0]}>
            <Heading as="h1" scale="xxl" color="secondary" mb="24px">
              {t('Garden')}
            </Heading>
            <Heading scale="lg" color="text">
              {t('Stake PLANT to earn new tokens.')}<br />
              {t('You can unstake at any time.')}<br />
              {t('Rewards are calculated per block.')}<br />
              {t('If you still have tokens in ')} 
              <NavLink exact activeClassName="active" to="/pools" id="lottery-pot-banner">
                <Button p="0" variant="text">
                  <ArrowForwardIcon color="primary" />
                  <Text color="primary" bold fontSize="16px" mr="4px">
                    {t('Garden V1')}
                  </Text>
                </Button>
              </NavLink>
            </Heading>
          </Flex>
          <Flex flex="1" height="fit-content" justifyContent="center" alignItems="center" mt={['24px', null, '0']}>
            <img src="/images/garden.svg" alt="Gardens" width={600} height={315} />
          </Flex>
        </Flex>
      </PageHeader>
      <Page>
        <ControlContainer>
          <ViewControls>
            <ToggleView viewMode={viewMode} onToggle={(mode: ViewMode) => setViewMode(mode)} />
            <ToggleWrapper>
              <Toggle checked={stakedOnly} onChange={() => setStakedOnly(!stakedOnly)} scale="sm" />
              <Text> {t('Staked only')}</Text>
            </ToggleWrapper>
            <GardenTabButtons hasStakeInFinishedGardens={stakedInactiveGardens.length > 0} />
          </ViewControls>
          <FilterContainer>
            <LabelWrapper>
              <Text textTransform="uppercase">{t('Sort by')}</Text>
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
                    label: t('Multiplier'),
                    value: 'multiplier',
                  },
                  {
                    label: t('Earned'),
                    value: 'earned',
                  },
                  {
                    label: t('Liquidity'),
                    value: 'liquidity',
                  },
                ]}
                onChange={handleSortOptionChange}
              />
            </LabelWrapper>
            <LabelWrapper style={{ marginLeft: 16 }}>
              <Text textTransform="uppercase">{t('Search')}</Text>
              <SearchInput onChange={handleChangeQuery} placeholder="Search Gardens" />
            </LabelWrapper>
          </FilterContainer>
        </ControlContainer>
        {renderContent()}
        {account && !userDataLoaded && stakedOnly && (
          <Flex justifyContent="center">
            <Loading />
          </Flex>
        )}
        <div ref={loadMoreRef} />
        <EndPage />
      </Page>
    </>
  )
}

export default Gardens
