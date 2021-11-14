import plantswapMarketABI from 'config/abi/plantswapMarket.json'
import { getPlantswapMarketAddress } from 'utils/addressHelpers'
import multicall from 'utils/multicall'

type MarketData = {
    isListingSold: number
    isListingActive: number
    isListingCancel: number
}
  
const fetchListingEta = async (listingId: number): Promise<MarketData> => {
  const plantswapMarketAddress = getPlantswapMarketAddress()
  const calls = [
    {
      address: plantswapMarketAddress,
      name: 'isListingSold',
      params: [listingId],
    },
    {
      address: plantswapMarketAddress,
      name: 'isListingActive',
      params: [listingId],
    },
    {
      address: plantswapMarketAddress,
      name: 'isListingCancel',
      params: [listingId],
    },
  ]
  const [
    isListingSold, 
    isListingActive, 
    isListingCancel ] =
    await multicall(plantswapMarketABI, calls)
  return {
    isListingSold: isListingSold.toJSON(),
    isListingActive: isListingActive.toJSON(),
    isListingCancel: isListingCancel.toJSON(),
  }
}
  
export default fetchListingEta