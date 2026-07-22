import { Contract, Provider, Signer } from 'ethers'
import BigNumber from 'bignumber.js'
import { simpleRpcProvider } from 'utils/providers'
import { verticalGardensConfig, collectiblesFarmConfig, poolsConfig } from 'config/constants'
import { PoolCategory } from 'config/constants/types'

// Addresses
import {
  getAddress,
  getPlantAddress,
  getMasterGardenerAddress,
  getCollectiblesFarmContractAddress,
  getPlantswapGardenersAddress,
  getFoundationNonProfitAddress,
  getPlantswapMarketAddress,
  getPlantProfileAddress,
  getPlantProfileExtra1Address,
  getGardeningSchoolNftAddress,
  getMasterGardeningSchoolNftAddress,
  getPointsRewardSchoolNftAddress,
  getSharePlantswapLoveSchooldNftAddress,
  getMulticallAddress,
} from 'utils/addressHelpers'

// ABI
import plantAbi from 'config/abi/plant.json'
  // Farms and Gardens
import masterGardener from 'config/abi/masterchef.json'
import verticalGardens from 'config/abi/verticalGardens.json'
import plantswapCollectiblesFarming from 'config/abi/plantswapCollectiblesFarming.json'
import collectiblesFarmingPool from 'config/abi/collectiblesFarmingPool.json'
  // GardenV1
import sousChef from 'config/abi/sousChef.json'
  // Collectibles
import plantswapGardenersAbi from 'config/abi/plantswapGardeners.json'
  // Foundations
import plantswapFoundationNonProfitAbi from 'config/abi/plantswapFoundationNonProfit.json'
  // Market
import plantswapPlantswapMarketAbi from 'config/abi/plantswapMarket.json'
  // Profile
import profileABI from 'config/abi/plantswapGardenersProfile.json'
import plantswapProfileExtra1ABI from 'config/abi/plantswapGardenersProfileExtra1.json'
  // Collectibles Claiming School
import gardeningSchoolNftAbi from 'config/abi/gardeningSchool.json'
import masterGardeningSchoolNftAbi from 'config/abi/masterGardeningSchool.json'
import pointsRewardSchoolAbi from 'config/abi/pointsRewardSchool.json'
import sharePlantswapLoveSchooldAbi from 'config/abi/sharePlantswapLoveSchoold.json'

  // Multicall and other basic abi
import bep20Abi from 'config/abi/erc20.json'
import erc721Abi from 'config/abi/erc721.json'
import lpTokenAbi from 'config/abi/lpToken.json'

  // Multicall, sous variants, and point center
import sousChefV2 from 'config/abi/sousChefV2.json'
import sousChefBnb from 'config/abi/sousChefBnb.json'
import MultiCallAbi from 'config/abi/Multicall.json'

const getContract = (abi: any, address: string, signer?: Signer | Provider) => {
  const signerOrProvider = signer ?? simpleRpcProvider
  return new Contract(address, abi, signerOrProvider)
}

// Plant token
export const getPlantContract = (signer?: Signer | Provider) => {
  return getContract(plantAbi, getPlantAddress(), signer)
}
// Farms and Gardens
export const getMasterchefContract = (signer?: Signer | Provider) => {
  return getContract(masterGardener, getMasterGardenerAddress(), signer)
}
export const getVerticalGardenContract = (id: number, signer?: Signer | Provider) => {
  const config = verticalGardensConfig.find((verticalGarden) => verticalGarden.vgId === id)
  const abi = verticalGardens
  return getContract(abi, getAddress(config.verticalGardenContractAddress), signer)
}
export const getCollectiblesFarmContract = (signer?: Signer | Provider) => {
  const abi = plantswapCollectiblesFarming
  return getContract(abi, getCollectiblesFarmContractAddress(), signer)
}
export const getCollectiblesFarmingPoolContract = (id: number, signer?: Signer | Provider) => {
  const config = collectiblesFarmConfig.find((collectiblesFarm) => collectiblesFarm.cfId === id)
  const abi = collectiblesFarmingPool
  return getContract(abi, getAddress(config.collectiblesFarmingPoolContract), signer)
}

// GardenV1
export const getSouschefContract = (id: number, signer?: Signer | Provider) => {
  const config = poolsConfig.find((pool) => pool.sousId === id)
  const abi = config.poolCategory === PoolCategory.BINANCE ? sousChefBnb : sousChef
  return getContract(abi, getAddress(config.contractAddress), signer)
}
// Collectibles
export const getPlantswapGardenersContract = (signer?: Signer | Provider) => {
  return getContract(plantswapGardenersAbi, getPlantswapGardenersAddress(), signer)
}
// Market
export const getPlantswapMarketContract = (signer?: Signer | Provider) => {
  return getContract(plantswapPlantswapMarketAbi, getPlantswapMarketAddress(), signer)
}
// Foundations
export const getFoundationNonProfitContract = (signer?: Signer | Provider) => {
  return getContract(plantswapFoundationNonProfitAbi, getFoundationNonProfitAddress(), signer)
}
// Profile
export const getProfileContract = (signer?: Signer | Provider) => {
  return getContract(profileABI, getPlantProfileAddress(), signer)
}
export const getProfileExtra1Contract = (signer?: Signer | Provider) => {
  return getContract(plantswapProfileExtra1ABI, getPlantProfileExtra1Address(), signer)
}
// Collectibles Claiming School
export const getGardeningSchoolNftContract = (signer?: Signer | Provider) => {
  return getContract(gardeningSchoolNftAbi, getGardeningSchoolNftAddress(), signer)
}
export const getMasterGardeningSchoolNftContract = (signer?: Signer | Provider) => {
  return getContract(masterGardeningSchoolNftAbi, getMasterGardeningSchoolNftAddress(), signer)
}
export const getPointsRewardSchoolNftContract = (signer?: Signer | Provider) => {
  return getContract(pointsRewardSchoolAbi, getPointsRewardSchoolNftAddress(), signer)
}
export const getSharePlantswapLoveSchoolNftContract = (signer?: Signer | Provider) => {
  return getContract(sharePlantswapLoveSchooldAbi, getSharePlantswapLoveSchooldNftAddress(), signer)
}
// Multicall and other basic abi
export const getMulticallContract = (signer?: Signer | Provider) => {
  return getContract(MultiCallAbi, getMulticallAddress(), signer)
}
export const getBep20Contract = (address: string, signer?: Signer | Provider) => {
  return getContract(bep20Abi, address, signer)
}
export const getErc721Contract = (address: string, signer?: Signer | Provider) => {
  return getContract(erc721Abi, address, signer)
}
export const getLpContract = (address: string, signer?: Signer | Provider) => {
  return getContract(lpTokenAbi, address, signer)
}

/**
 * Returns true when `owner`'s allowance on `contract` for `spender` is at least `required`.
 * Swallows errors and returns false so callers can use it interchangeably in onRequiresApproval
 * callbacks without per-site try/catch boilerplate.
 */
export const hasSufficientAllowance = async (
  contract: Contract,
  owner: string,
  spender: string,
  required: BigNumber,
): Promise<boolean> => {
  try {
    const response = await contract.allowance(owner, spender)
    // Ethers v6 returns native bigint; bignumber.js v11 accepts bigint directly.
    const currentAllowance = new BigNumber(response.toString())
    return currentAllowance.gte(required)
  } catch (error) {
    return false
  }
}


// Other helpers
export const getSouschefV2Contract = (id: number, signer?: Signer | Provider) => {
  const config = poolsConfig.find((pool) => pool.sousId === id)
  return getContract(sousChefV2, getAddress(config.contractAddress), signer)
}
