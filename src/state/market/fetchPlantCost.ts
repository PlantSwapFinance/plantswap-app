import plantswapMarketABI from 'config/abi/plantswapMarket.json'
import { getPlantswapMarketAddress } from 'utils/addressHelpers'
import multicall from 'utils/multicall'

type MarketData = {
    costPlantToUpdate: number
    costPlantToSell: number
    costPlantToBuy: number
    costPlantToExtra: number
}
    
const fetchMarket = async (): Promise<MarketData> => {
    const plantswapMarketAddress = getPlantswapMarketAddress()
    const calls = [
        {
            address: plantswapMarketAddress,
            name: 'getCostPlantToUpdate',
        },
        {
            address: plantswapMarketAddress,
            name: 'getCostPlantToSell',
        },
        {
            address: plantswapMarketAddress,
            name: 'getCostPlantToBuy',
        },
        {
            address: plantswapMarketAddress,
            name: 'getCostPlantToExtra',
        },
        ]
    const [
        costPlantToUpdate, 
        costPlantToSell, 
        costPlantToBuy, 
        costPlantToExtra ] =
        await multicall(plantswapMarketABI, calls)
    return {
        costPlantToUpdate: costPlantToUpdate.toJSON(),
        costPlantToSell: costPlantToSell.toJSON(),
        costPlantToBuy: costPlantToBuy.toJSON(),
        costPlantToExtra: costPlantToExtra.toJSON(),
    }
}
    
export default fetchMarket