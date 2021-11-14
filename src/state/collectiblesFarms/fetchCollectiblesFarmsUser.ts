import collectiblesFarmsConfig from 'config/constants/collectiblesFarms'
import collectiblesFarmABI from 'config/abi/collectiblesFarmingPool.json'
import erc20ABI from 'config/abi/erc20.json'
import plantswapGardenersABI from 'config/abi/plantswapGardeners.json'
import multicall from 'utils/multicall'
import { getAddress, getPlantswapGardenersAddress } from 'utils/addressHelpers'
// import { getNftByTokenId } from 'utils/collectibles'
import BigNumber from 'bignumber.js'

const listCollectiblesFarms = collectiblesFarmsConfig.filter((c) => c.cfId)
export const fetchCollectiblesFarmsRewardTokenAllowance = async (account) => {
    const calls = listCollectiblesFarms.map((c) => ({
    address: getAddress(c.stakingRewardToken.address),
    name: 'allowance',
    params: [account, getAddress(c.collectiblesFarmingPoolContract)],
  }))

  const allowancesRewardToken = await multicall(erc20ABI, calls)
  return listCollectiblesFarms.reduce(
    (acc, collectiblesFarm, index) => ({ ...acc, [collectiblesFarm.cfId]: new BigNumber(allowancesRewardToken[index]).toJSON() }),
    {},
  ) 
}

export const fetchCollectiblesFarmsExtraRewardTokenAllowance = async (account, isExtraReward: boolean) => {
  if(isExtraReward) {
    const calls = collectiblesFarmsConfig.map((c) => ({
      address: getAddress(c.stakingExtraRewardToken.address),
      name: 'allowance',
      params: [account, getAddress(c.collectiblesFarmingPoolContract)],
    }))

    const allowancesExtraRewardToken = await multicall(erc20ABI, calls)
    return collectiblesFarmsConfig.reduce(
      (acc, collectiblesFarm, index) => ({ ...acc, [collectiblesFarm.cfId]: new BigNumber(allowancesExtraRewardToken[index]).toJSON() }),
      {},
    )
  }
  return null
}

export const fetchCollectiblesFarmsIsApprovedForAll = async (account) => {
  const calls = collectiblesFarmsConfig.map((c) => ({
    address: getPlantswapGardenersAddress(),
    name: 'isApprovedForAll',
    params: [account, getAddress(c.collectiblesFarmingPoolContract)],
  }))

  const isApprovedForAll = await multicall(plantswapGardenersABI, calls)
  return collectiblesFarmsConfig.reduce(
    (acc, collectiblesFarm, index) => ({ ...acc, [collectiblesFarm.cfId]: isApprovedForAll[index] }),
    {},
  )
}

export const fetchUserCollectiblesBalance = async (account) => {
  const calls = collectiblesFarmsConfig.map((c) => ({
   address: getAddress(c.collectiblesFarmingPoolContract),
   name: 'collectiblesBalance',
   params: [account],
 }))
 const collectiblesBalances = await multicall(collectiblesFarmABI, calls)
 const collectiblesBalance = collectiblesFarmsConfig.reduce(
   (acc, collectiblesFarm, index) => ({...acc, [collectiblesFarm.cfId]: new BigNumber(collectiblesBalances[index][0]).toJSON(), }),
   {},
 )

 return { ...collectiblesBalance }
}

export const fetchUserCollectiblesUses = async (account) => {
  const calls = collectiblesFarmsConfig.map((c) => ({
    address: getAddress(c.collectiblesFarmingPoolContract),
    name: 'collectiblesUse',
    params: [account],
  }))
  const collectiblesUse = await multicall(collectiblesFarmABI, calls)
  const collectiblesUses = collectiblesFarmsConfig.reduce(
    (acc, collectiblesFarm, index) => ({...acc, [collectiblesFarm.cfId]: new BigNumber(collectiblesUse[index][0]).toJSON(), }),
    {},
  )

  return { ...collectiblesUses }
}

export const fetchUserBalances = async (account, nftAddress = getPlantswapGardenersAddress()) => {
  const calls = collectiblesFarmsConfig.map(() => ({
    address: nftAddress,
    name: 'balanceOf',
    params: [account],
  }))
  const gardeners = await multicall(collectiblesFarmABI, calls)
  const stakedBalances = collectiblesFarmsConfig.reduce(
    (acc, collectiblesFarm, index) => ({...acc, [collectiblesFarm.cfId]: new BigNumber(gardeners[index][0]._hex).toJSON(), }),
    {},
  )

  return { ...stakedBalances }
}

export const fetchUserToken = async (account, cfId, collectiblesFarmingPoolContract, collectiblesUse) => {
  
  const nftDataFetchPromises = []
  for (let i = 1; i <= collectiblesUse[cfId]; i++) {
    nftDataFetchPromises.push({
      address: getAddress(collectiblesFarmingPoolContract),
      name: 'collectiblesUseByUser',
      params: [account, i],
    })
  }
  const tokenIdBn = await multicall(collectiblesFarmABI, nftDataFetchPromises)
  const tokenIds = nftDataFetchPromises.map((c) => (
    new BigNumber(tokenIdBn[c.params[1] - 1][0]._hex).toJSON()
  ))
  
  return { ...tokenIds }
}

export const fetchUserRewardsHarvested = async (account) => {
  const calls = collectiblesFarmsConfig.map((c) => ({
    address: getAddress(c.collectiblesFarmingPoolContract),
    name: 'rewardsHarvested',
    params: [account],
  }))
  const res = await multicall(collectiblesFarmABI, calls)
  const rewardsHarvesteds = collectiblesFarmsConfig.reduce(
    (acc, collectiblesFarm, index) => ({
      ...acc,
      [collectiblesFarm.cfId]: new BigNumber(res[index][0]).toJSON(),
    }),
    {},
  )

  return { ...rewardsHarvesteds }
}

export const fetchUserExtraRewardsHarvested = async (account) => {
  const calls = collectiblesFarmsConfig.map((c) => ({
    address: getAddress(c.collectiblesFarmingPoolContract),
    name: 'extraRewardsHarvested',
    params: [account],
  }))
  const res = await multicall(collectiblesFarmABI, calls)
  const extraRewardsHarvesteds = collectiblesFarmsConfig.reduce(
    (acc, collectiblesFarm, index) => ({
      ...acc,
      [collectiblesFarm.cfId]: new BigNumber(res[index][0]).toJSON(),
    }),
    {},
  )

  return { ...extraRewardsHarvesteds }
}

