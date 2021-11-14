import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Route, useLocation, useRouteMatch } from 'react-router-dom'
import styled from 'styled-components'
import orderBy from 'lodash/orderBy'
import { Text, Toggle, Flex, RowType } from '@plantswap/uikit'
import { useWeb3React } from '@web3-react/core'
import nfts from 'config/constants/nfts'
import usePersistState from 'hooks/usePersistState'
import SearchInput from 'components/SearchInput'
import Loading from 'components/Loading'
import Select, { OptionProps } from 'components/Select/Select'
import { useAppDispatch } from 'state'
import { fetchWalletNfts } from 'state/collectibles'
import { useGetCollectibles } from 'state/hooks'
import { useTranslation } from 'contexts/Localization'
import { latinise } from 'utils/latinise'
import { useProfile } from 'state/profile/hooks'
// import { useMasterGardeningSchoolNftContract } from 'hooks/useContract'
import NftCard from './NftCard'
// import NftTabButtons from './NftTabButtons'
import Table from './NftTable/NftTable'
import { RowProps } from './NftTable/Row'
import { ExtraProps } from './NftTable/Extra'
import NftGrid from './NftGrid'
import ToggleView from './ToggleView/ToggleView'
import { DesktopColumnSchema, ViewMode } from './types'
import MasterGardeningSchoolNftCard from './NftCard/MasterGardeningSchoolNftCard'

/**
 * A map of bunnyIds to special campaigns (NFT distribution)
 * Each NftCard is responsible for checking it's own claim status
 *
 */
const nftComponents = {
  'Relax PLANT Farmer': MasterGardeningSchoolNftCard,
  'Relax PLANT BNB Gardener': MasterGardeningSchoolNftCard,
  'Relax PLANT BUSD Farmer': MasterGardeningSchoolNftCard,
  'Relax PLANT USDC Farmer': MasterGardeningSchoolNftCard,
  'Relax PLANT CAKE Gardener': MasterGardeningSchoolNftCard,
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

const NUMBER_OF_COLLECTIBLES_VISIBLE = 8

const NftList = () => {
  const { path } = useRouteMatch()
  const { pathname } = useLocation()
  const { t } = useTranslation()
  const { tokenIds } = useGetCollectibles()
  const dispatch = useAppDispatch()
  const { account } = useWeb3React()
  const { profile } = useProfile()
  // const { team } = profile ?? {}
  // const masterGardeningSchoolNftContract = useMasterGardeningSchoolNftContract()
  const [viewMode, setViewMode] = usePersistState(ViewMode.TABLE, { localStorageKey: 'plant_collectibles_view' })
  // eslint-disable-next-line
  const [query, setQuery] = useState('')
  // eslint-disable-next-line
  const [sortOption, setSortOption] = useState('new')
  const chosenCollectiblesLength = useRef(0)
  const userDataReady = !account || (!!account)

  const isArchived = pathname.includes('archived')
  const isInactive = pathname.includes('history')
  const isActive = !isInactive && !isArchived

  const [walletOnly, setWalletOnly] = useState(!isActive)


  const allCollectibles = nfts
  const claimableCollectibles = nfts


  let walletOnlyCollectibles = allCollectibles
  let walletInactiveCollectibles = claimableCollectibles
  
  if(tokenIds) {
    walletOnlyCollectibles = allCollectibles.filter((nft) => nft.identifier && (tokenIds[nft.identifier] || profile?.nft?.identifier === nft.identifier))
    walletInactiveCollectibles = claimableCollectibles.filter((nft) => nft.identifier && (tokenIds[nft.identifier] || profile?.nft?.identifier === nft.identifier))
  }

  const handleRefresh = () => {
    dispatch(fetchWalletNfts(account))
  }
  
  const collectiblesList = useCallback(
    (collectiblesToDisplay) => {
      let collectiblesToDisplayWithAPR = collectiblesToDisplay.map((nft) => {
      

        return { ...nft }
      })

      if (query) {
        const lowercaseQuery = latinise(query.toLowerCase())
        collectiblesToDisplayWithAPR = collectiblesToDisplay.filter((nft) => {
          return latinise(nft.name.toLowerCase()).includes(lowercaseQuery)
        })
      }
      return collectiblesToDisplayWithAPR
    },
    [query],
  )

  const handleChangeQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value)
  }

  
  const loadMoreRef = useRef<HTMLDivElement>(null)

  const [numberOfCollectiblesVisible, setNumberOfCollectiblesVisible] = useState(NUMBER_OF_COLLECTIBLES_VISIBLE)
  const [observerIsSet, setObserverIsSet] = useState(false)

  const chosenCollectiblesMemoized = useMemo(() => {
    let chosenCollectibles = []

    const sortCollectibles = (collectibles) => {
      switch (sortOption) {
        case 'name':
          return orderBy(collectibles, (nft: ExtraProps) => nft.name, 'asc')
        case 'variantId':
          return orderBy(collectibles, (nft: ExtraProps) => nft.name, 'desc')
        case 'idenditifier':
          return orderBy(collectibles, (nft: ExtraProps) => nft.name, 'desc')
        default:
          return collectibles
      }
    }

    if (isActive) {
      chosenCollectibles = walletOnly ? collectiblesList(walletOnlyCollectibles) : collectiblesList(allCollectibles)
    }
    if (isInactive) {
      chosenCollectibles = walletOnly ? collectiblesList(walletInactiveCollectibles) : collectiblesList(claimableCollectibles)
    }


    return sortCollectibles(chosenCollectibles).slice(0, numberOfCollectiblesVisible)
  }, [
    sortOption,
    walletOnly,
    isActive,
    isInactive,
    collectiblesList,
    allCollectibles,
    walletOnlyCollectibles,
    claimableCollectibles,
    walletInactiveCollectibles,
    numberOfCollectiblesVisible,
  ])

  chosenCollectiblesLength.current = chosenCollectiblesMemoized.length

  useEffect(() => {
    const showMoreCollectibles = (entries) => {
      const [entry] = entries
      if (entry.isIntersecting) {
        setNumberOfCollectiblesVisible((gardensCurrentlyVisible) => {
          if (gardensCurrentlyVisible <= chosenCollectiblesLength.current) {
            return gardensCurrentlyVisible + NUMBER_OF_COLLECTIBLES_VISIBLE
          }
          return gardensCurrentlyVisible
        })
      }
    }

    if (!observerIsSet) {
      const loadMoreObserver = new IntersectionObserver(showMoreCollectibles, {
        rootMargin: '0px',
        threshold: 1,
      })
      loadMoreObserver.observe(loadMoreRef.current)
      setObserverIsSet(true)
    } 
  }, [chosenCollectiblesMemoized, observerIsSet])
  
  const rowData = chosenCollectiblesMemoized.map((nft) => {

    const row: RowProps = {
      image: {
        images: nft.images.lg,
        alt: nft.name,
      },
      name: {
        name: nft.name,
        sortOrder: nft.sortOrder,
        identifier: nft.identifier,
        variationId: nft.variationId,
        type: nft.type,
      },
      description: {
        description: nft.description,
        requirement: nft.requirement,
      },
      more: {
        identifier: nft.identifier,
      },
      details: {
        image: {
          images: nft.images.lg,
          alt: nft.name,
        },
        name: {
          name: nft.name,
          sortOrder: nft.sortOrder,
          identifier: nft.identifier,
          variationId: nft.variationId,
          type: nft.type,
        },
        description: {
          description: nft.description,
          requirement: nft.requirement,
        },
        more: {
          identifier: nft.identifier,
        },
        expanded: false,
      },
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
            case 'name':
              return b.id - a.id
            case 'variantId':
              return b.id - a.id
            case 'idenditifier':
              return b.id - a.id
            default:
              return 1
          }
        },
        sortable: column.sortable,
      }))
      return <Table data={rowData} columns={columns} userDataReady={userDataReady} />
    }

    return (
      <NftGrid>
        <Route exact path={`${path}`}>
          {chosenCollectiblesMemoized.map((nft) => {
              const Card = nftComponents[nft.identifier] || NftCard
      
              return (
                <div key={nft.name}>
                  <Card nft={nft} tokenIds={tokenIds[nft.identifier]} refresh={handleRefresh} />
                </div>
              )
            })}
        </Route>
        <Route exact path={`${path}/claimable`}>
          {orderBy(nfts, 'sortOrder').map((nft) => {
            const Card = nftComponents[nft.identifier] || NftCard
    
            return (
              <div key={nft.name}>
                <Card nft={nft} tokenIds={tokenIds[nft.identifier]} refresh={handleRefresh} />
              </div>
            )
          })}
        </Route>
        <Route exact path={`${path}/archived`}>
          {orderBy(nfts, 'sortOrder').map((nft) => {
            const Card = nftComponents[nft.identifier] || NftCard
    
            return (
              <div key={nft.name}>
                <Card nft={nft} tokenIds={tokenIds[nft.identifier]} refresh={handleRefresh} />
              </div>
            )
          })}
        </Route>
      </NftGrid>
    )
  }

  const handleSortOptionChange = (option: OptionProps): void => {
    setSortOption(option.value)
  }

  return (
    <>
    <ControlContainer>
        <ViewControls>
          <ToggleView viewMode={viewMode} onToggle={(mode: ViewMode) => setViewMode(mode)} />
            <ToggleWrapper>
              <Toggle checked={walletOnly} onChange={() => setWalletOnly(!walletOnly)} scale="sm" />
              <Text> {t('Only auction')}</Text>
            </ToggleWrapper>
            <ToggleWrapper>
              <Toggle checked={walletOnly} onChange={() => setWalletOnly(!walletOnly)} scale="sm" />
              <Text> {t("Only collectibles I don't have")}</Text>
            </ToggleWrapper>
        </ViewControls>
        <FilterContainer>
          <LabelWrapper>
            <Text textTransform="uppercase">{t('Sort by')}</Text>
            <Select
              options={[
                {
                  label: t('Sell type'),
                  value: 'sellType',
                },
                {
                  label: t('Auction end date'),
                  value: 'auctionEndData',
                },
                {
                  label: t('Hot'),
                  value: 'hot',
                },
                {
                  label: t('Name'),
                  value: 'name',
                },
                {
                  label: t('GardenerId'),
                  value: 'variantId',
                },
                {
                  label: t('Identifier'),
                  value: 'idenditifier',
                },
              ]}
              onChange={handleSortOptionChange}
            />
          </LabelWrapper>
          <LabelWrapper style={{ marginLeft: 16 }}>
            <Text textTransform="uppercase">{t('Search')}</Text>
            <SearchInput onChange={handleChangeQuery} placeholder="Search Offers" />
          </LabelWrapper>
        </FilterContainer>
      </ControlContainer>
        {renderContent()}
        <Flex justifyContent="center">
          <Loading />
        </Flex>
        <div ref={loadMoreRef} />
    </>
  )
}

export default NftList
// <NftTabButtons isClaimable={false} />