import plantswapMarketABI from 'config/abi/plantswapMarket.json'
import { getPlantswapMarketAddress } from 'utils/addressHelpers'
import multicall from 'utils/multicall'

export const fetchMarketListingMeta = async (listingId: number) => {
  const plantswapMarketAddress = getPlantswapMarketAddress()
  const calls = [
    {
      address: plantswapMarketAddress,
      name: 'getListingMeta',
      params: [listingId],
    },
  ]
  const rawListingMeta = await multicall(plantswapMarketABI, calls)
  const parsedListingMeta = rawListingMeta.map((listingMeta) => {
    return {
      seller: listingMeta[0].toJSON(),
      sellType: listingMeta[1].toJSON(),
      sellTypeValue: listingMeta[2].toJSON(),
      blocknumber: listingMeta[3].toJSON(),
      isSold: listingMeta[4].toJSON(),
      isActive: listingMeta[5].toJSON(),
    }
  })
  return parsedListingMeta
}

export const fetchMarketListingBuyData = async (listingId: number) => {
  const plantswapMarketAddress = getPlantswapMarketAddress()
  const calls = [
    {
      address: plantswapMarketAddress,
      name: 'getListingBuyData',
      params: [listingId],
    },
  ]
  const rawListingBuyData = await multicall(plantswapMarketABI, calls)
  const parsedListingBuyData = rawListingBuyData.map((listingBuyData) => {
    return {
      buyNftElseToken: listingBuyData[0].toJSON(),
      buyTokenAddress: listingBuyData[1].toJSON(),
      buyTokenId: listingBuyData[2].toJSON(),
      buyCount: listingBuyData[3].toJSON(),
    }
  })
  return parsedListingBuyData
}

export const fetchMarketListingSellData = async (listingId: number) => {
  const plantswapMarketAddress = getPlantswapMarketAddress()
  const calls = [
    {
      address: plantswapMarketAddress,
      name: 'getListingSellData',
      params: [listingId],
    },
  ]
  const rawListingSellData = await multicall(plantswapMarketABI, calls)
  const parsedListingSellData = rawListingSellData.map((listingSellData) => {
    return {
      sellNftElseToken: listingSellData[0].toJSON(),
      sellTokenAddress: listingSellData[1].toJSON(),
      sellTokenId: listingSellData[2].toJSON(),
      sellCount: listingSellData[3].toJSON(),
    }
  })
  return parsedListingSellData
}

export const fetchMarketListingStats = async (listingId: number) => {
  const plantswapMarketAddress = getPlantswapMarketAddress()
  const calls = [
    {
      address: plantswapMarketAddress,
      name: 'getListingStats',
      params: [listingId],
    },
  ]
  const rawListingStats = await multicall(plantswapMarketABI, calls)
  const parsedListingStats = rawListingStats.map((listingStats) => {
    return {
      countExtraToListingsId: listingStats[0].toJSON(),
      countOfferToListingsId: listingStats[1].toJSON(),
      isActive: listingStats[2].toJSON(),
      isCanceled: listingStats[3].toJSON(),
    }
  })
  return parsedListingStats
}

export const fetchMarketItem = async (itemId: number) => {
  const plantswapMarketAddress = getPlantswapMarketAddress()
  const calls = [
    {
      address: plantswapMarketAddress,
      name: 'getItem',
      params: [itemId],
    },
  ]
  const rawItem = await multicall(plantswapMarketABI, calls)
  const parsedItem = rawItem.map((item) => {
    return {
      nft: item[0].toJSON(),
      itemAddress: item[1].toJSON(),
      tokenId: item[2].toJSON(),
      countActive: item[3].toJSON(),
      countSold: item[3].toJSON(),
      countUnclaim: item[3].toJSON(),
    }
  })
  return parsedItem
}