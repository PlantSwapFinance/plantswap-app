import BigNumber from 'bignumber.js'
import collectiblesFarmsConfig from 'config/constants/collectiblesFarms'
import collectiblesFarmingPoolABI from 'config/abi/collectiblesFarmingPool.json'
import multicall from 'utils/multicall'
import { getAddress } from 'utils/addressHelpers'

export const fetchCollectiblesFarmTotalStaked = async () => { // NEW
 const callsTotalStaked = collectiblesFarmsConfig.map((collectiblesFarmConfig) => {
  return {
      address: getAddress(collectiblesFarmConfig.collectiblesFarmingPoolContract),
      name: 'collectiblesStaked',
    }
})
 const callsNftAddress = collectiblesFarmsConfig.map((collectiblesFarmConfig) => {
    return {
      address: getAddress(collectiblesFarmConfig.collectiblesFarmingPoolContract),
      name: 'nftAddress',
    }
  })
  const callsTotalTokenPerBlock = collectiblesFarmsConfig.map((collectiblesFarmConfig) => {
    return {
      address: getAddress(collectiblesFarmConfig.collectiblesFarmingPoolContract),
      name: 'totalTokenPerBlock',
    }
  })

  const callsVariantIdStart = collectiblesFarmsConfig.map((collectiblesFarmConfig) => {
    return {
      address: getAddress(collectiblesFarmConfig.collectiblesFarmingPoolContract),
      name: 'variantIdStart',
    }
  })

  const callsVariantIdEnd = collectiblesFarmsConfig.map((collectiblesFarmConfig) => {
    return {
      address: getAddress(collectiblesFarmConfig.collectiblesFarmingPoolContract),
      name: 'variantIdEnd',
    }
  })
  
  const callsIsActive = collectiblesFarmsConfig.map((collectiblesFarmConfig) => {
    return {
      address: getAddress(collectiblesFarmConfig.collectiblesFarmingPoolContract),
      name: 'isActive',
    }
  })
  
  const callsIsAddedByUser = collectiblesFarmsConfig.map((collectiblesFarmConfig) => {
    return {
      address: getAddress(collectiblesFarmConfig.collectiblesFarmingPoolContract),
      name: 'isAddedByUser',
    }
  })
  
  const callsDepositBlockTimeMinimum = collectiblesFarmsConfig.map((collectiblesFarmConfig) => {
    return {
      address: getAddress(collectiblesFarmConfig.collectiblesFarmingPoolContract),
      name: 'depositBlockTimeMinimum',
    }
  })
  
  const callsDepositPointsPerToken = collectiblesFarmsConfig.map((collectiblesFarmConfig) => {
    return {
      address: getAddress(collectiblesFarmConfig.collectiblesFarmingPoolContract),
      name: 'depositPointsPerToken',
    }
  })

  const totalStakeds = await multicall(collectiblesFarmingPoolABI, callsTotalStaked)
  const nftAddresss = await multicall(collectiblesFarmingPoolABI, callsNftAddress)
  const totalTokenPerBlocks = await multicall(collectiblesFarmingPoolABI, callsTotalTokenPerBlock)
  const variantIdStarts = await multicall(collectiblesFarmingPoolABI, callsVariantIdStart)
  const variantIdEnds = await multicall(collectiblesFarmingPoolABI, callsVariantIdEnd)
  const isActives = await multicall(collectiblesFarmingPoolABI, callsIsActive)
  const isAddedByUsers = await multicall(collectiblesFarmingPoolABI, callsIsAddedByUser)
  const depositBlockTimeMinimums = await multicall(collectiblesFarmingPoolABI, callsDepositBlockTimeMinimum)
  const depositPointsPerTokens = await multicall(collectiblesFarmingPoolABI, callsDepositPointsPerToken)
  
  return collectiblesFarmsConfig.map((plantCollectiblesFarmConfig, index) => {
    const totalStaked = totalStakeds[index]
    const nftAddress = nftAddresss[index]
    const totalTokenPerBlock = totalTokenPerBlocks[index]
    const variantIdStart:number = variantIdStarts[index]
    const variantIdEnd:number  = variantIdEnds[index]
    const isActive:boolean = isActives[index]
    const isAddedByUser = isAddedByUsers[index]
    const depositBlockTimeMinimum = depositBlockTimeMinimums[index]
    const depositPointsPerToken = depositPointsPerTokens[index]
    return {
      cfId: plantCollectiblesFarmConfig.cfId,
      totalStaked: new BigNumber(totalStaked).toJSON(),
      nftAddress,
      totalTokenPerBlock: new BigNumber(totalTokenPerBlock).toJSON(),
      variantIdStart,
      variantIdEnd, 
      isActive,
      isAddedByUser: new BigNumber(isAddedByUser).toJSON(),
      depositBlockTimeMinimum: new BigNumber(depositBlockTimeMinimum).toJSON(),
      depositPointsPerToken: new BigNumber(depositPointsPerToken).toJSON(),
    }
  })
}
/*
export const fetchCollectiblesFarmInfo = async () => { // NEW
  const collectiblesFarmsInfo = collectiblesFarmsConfig.filter((c) => c.cfId !== 0)
  const callsIsActive = collectiblesFarmsInfo.map((collectiblesFarmConfig) => {
    return {
      address: getAddress(collectiblesFarmConfig.collectiblesFarmingPoolContract),
      name: 'isActive',
    }
  })
  const callsLlastRewardBlock = collectiblesFarmsInfo.map((collectiblesFarmConfig) => {
    return {
      address: getAddress(collectiblesFarmConfig.collectiblesFarmingPoolContract),
      name: 'lastRewardBlock',
    }
  })

  const callsLastReward = collectiblesFarmsInfo.map((collectiblesFarmConfig) => {
    return {
      address: getAddress(collectiblesFarmConfig.collectiblesFarmingPoolContract),
      name: 'lastRewards',
    }
  })
  
  const callsLastNftStakedCount = collectiblesFarmsInfo.map((collectiblesFarmConfig) => {
    return {
      address: getAddress(collectiblesFarmConfig.collectiblesFarmingPoolContract),
      name: 'lastNftStakedCount',
    }
  })
  
  const callsTotalTokenPerBlock = collectiblesFarmsInfo.map((collectiblesFarmConfig) => {
    return {
      address: getAddress(collectiblesFarmConfig.collectiblesFarmingPoolContract),
      name: 'totalTokenPerBlock',
    }
  })

  const isActives = await multicall(collectiblesFarmingPoolABI, callsIsActive)
  const lastRewardBlocks = await multicall(collectiblesFarmingPoolABI, callsLlastRewardBlock)
  const lastRewards = await multicall(collectiblesFarmingPoolABI, callsLastReward)
  const lastNftStakedCounts = await multicall(collectiblesFarmingPoolABI, callsLastNftStakedCount)
  const totalTokenPerBlocks = await multicall(collectiblesFarmingPoolABI, callsTotalTokenPerBlock)

  return collectiblesFarmsInfo.map((plantCollectiblesFarmConfig, index) => {
    const isActive:number = isActives[index]
    const lastRewardBlock = lastRewardBlocks[index]
    const lastReward = lastRewards[index]
    const lastNftStakedCount = lastNftStakedCounts[index]
    const totalTokenPerBlock = totalTokenPerBlocks[index]
    return {
      cfId: plantCollectiblesFarmConfig.cfId,
      isActive,
      lastRewardBlock: new BigNumber(lastRewardBlock).toJSON(), 
      lastReward: new BigNumber(lastReward).toJSON(),
      lastNftStakedCount: new BigNumber(lastNftStakedCount).toJSON(),
      totalTokenPerBlock: new BigNumber(totalTokenPerBlock).toJSON(),
    }
  })
} */