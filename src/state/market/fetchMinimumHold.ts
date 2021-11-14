import plantswapMarketABI from 'config/abi/plantswapMarket.json'
import { getPlantswapMarketAddress } from 'utils/addressHelpers'
import multicall from 'utils/multicall'

type MarketData = {
    numberPlantToUpdate: number
    numberPlantToSell: number
    numberPlantToBuy: number
    numberPlantToExtra: number
    numberPlantToOffer: number
}
  
const fetchMarket = async (): Promise<MarketData> => {
    const plantswapMarketAddress = getPlantswapMarketAddress()
    const calls = [
        {
          address: plantswapMarketAddress,
          name: 'getNumberPlantToUpdate',
        },
        {
          address: plantswapMarketAddress,
          name: 'getNumberPlantToSell',
        },
        {
          address: plantswapMarketAddress,
          name: 'getNumberPlantToBuy',
        },
        {
          address: plantswapMarketAddress,
          name: 'getNumberPlantToExtra',
        },
        {
          address: plantswapMarketAddress,
          name: 'getNumberPlantToOffer',
        },
      ]
    const [
        numberPlantToUpdate, 
        numberPlantToSell, 
        numberPlantToBuy, 
        numberPlantToExtra, 
        numberPlantToOffer ] =
      await multicall(plantswapMarketABI, calls)
    return {
        numberPlantToUpdate: numberPlantToUpdate.toJSON(),
        numberPlantToSell: numberPlantToSell.toJSON(),
        numberPlantToBuy: numberPlantToBuy.toJSON(),
        numberPlantToExtra: numberPlantToExtra.toJSON(),
        numberPlantToOffer: numberPlantToOffer.toJSON(),
    }
}
  
export default fetchMarket