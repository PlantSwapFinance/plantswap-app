import plantswapMarketABI from 'config/abi/plantswapMarket.json'
import { getPlantswapMarketAddress } from 'utils/addressHelpers'
import multicall from 'utils/multicall'

type MarketData = {
    lastListingId: number
    numberActiveItems: number
    numberActiveSalesItems: number
    numberUnclaimedSaleItems: number
    numberSales: number
  }
  
const fetchMarket = async (): Promise<MarketData> => {
    const plantswapMarketAddress = getPlantswapMarketAddress()
    const calls = [
        {
          address: plantswapMarketAddress,
          name: 'getLastListingId',
        },
        {
          address: plantswapMarketAddress,
          name: 'getNumberActiveItems',
        },
        {
          address: plantswapMarketAddress,
          name: 'getNumberActiveSalesItems',
        },
        {
          address: plantswapMarketAddress,
          name: 'getNumberUnclaimedSaleItems',
        },
        {
          address: plantswapMarketAddress,
          name: 'getNumberSales',
        },
      ]
    const [
        lastListingId, 
        numberActiveItems, 
        numberActiveSalesItems, 
        numberUnclaimedSaleItems, 
        numberSales ] =
      await multicall(plantswapMarketABI, calls)
    return {
        lastListingId: lastListingId.toJSON(),
        numberActiveItems: numberActiveItems.toJSON(),
        numberActiveSalesItems: numberActiveSalesItems.toJSON(),
        numberUnclaimedSaleItems: numberUnclaimedSaleItems.toJSON(),
        numberSales: numberSales.toJSON(),
    }
  }
  
export default fetchMarket