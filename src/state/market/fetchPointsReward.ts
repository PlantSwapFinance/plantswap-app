import plantswapMarketABI from 'config/abi/plantswapMarket.json'
import { getPlantswapMarketAddress } from 'utils/addressHelpers'
import multicall from 'utils/multicall'

type MarketData = {
    numberPointToSell: number
    numberPointToBuy: number
    numberPointToExtra: number
    numberPointToOffer: number
}
    
const fetchMarket = async (): Promise<MarketData> => {
    const plantswapMarketAddress = getPlantswapMarketAddress()
    const calls = [
        {
            address: plantswapMarketAddress,
            name: 'getNumberPointToSell',
        },
        {
            address: plantswapMarketAddress,
            name: 'getNumberPointToBuy',
        },
        {
            address: plantswapMarketAddress,
            name: 'getNumberPointToExtra',
        },
        {
            address: plantswapMarketAddress,
            name: 'getNumberPointToOffer',
        },
        ]
    const [
        numberPointToSell, 
        numberPointToBuy, 
        numberPointToExtra, 
        numberPointToOffer ] =
        await multicall(plantswapMarketABI, calls)
    return {
        numberPointToSell: numberPointToSell.toJSON(),
        numberPointToBuy: numberPointToBuy.toJSON(),
        numberPointToExtra: numberPointToExtra.toJSON(),
        numberPointToOffer: numberPointToOffer.toJSON(),
    }
}
    
export default fetchMarket