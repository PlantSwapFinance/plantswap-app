import BigNumber from 'bignumber.js'
import verticalGardensConfig from 'config/constants/verticalGardens'
import verticalGardenABI from 'config/abi/verticalGardens.json'
import plantABI from 'config/abi/plant.json'
import wbnbABI from 'config/abi/weth.json'
import multicall from 'utils/multicall'
import { getAddress, getWbnbAddress } from 'utils/addressHelpers'

export const fetchVerticalGardenTotalStaked = async () => { // NEW
  const verticalGardensTotalStaked = verticalGardensConfig.filter((v) => v.vgId)
  const callsTotalStaked = verticalGardensTotalStaked.map((verticalGardenConfig) => {
    return {
      address: getAddress(verticalGardenConfig.verticalGardenContractAddress),
      name: 'totalStakedToken',
    }
  })
  const callsTotalStakedEachBlock = verticalGardensTotalStaked.map((verticalGardenConfig) => {
    return {
      address: getAddress(verticalGardenConfig.verticalGardenContractAddress),
      name: 'totalStakedTokenEachBlock',
    }
  })
  const callsTotalPendingStakedRewardToSplit = verticalGardensTotalStaked.map((verticalGardenConfig) => {
    return {
      address: getAddress(verticalGardenConfig.verticalGardenContractAddress),
      name: 'totalPendingRewardTokenToSplit',
    }
  })
  const callsTotalPendingPlantRewardToSplit = verticalGardensTotalStaked.map((verticalGardenConfig) => {
    return {
      address: getAddress(verticalGardenConfig.verticalGardenContractAddress),
      name: 'totalPendingPlantRewardToSplit',
    }
  })
  const callsPendingStakedInStakedMasterChef = verticalGardensTotalStaked.map((verticalGardenConfig) => {
    return {
      address: getAddress(verticalGardenConfig.verticalGardenContractAddress),
      name: 'pendingStakedTokenInStakedTokenMasterChef',
    }
  })
  const callsPendingPlantInPlantMasterGardener = verticalGardensTotalStaked.map((verticalGardenConfig) => {
    return {
      address: getAddress(verticalGardenConfig.verticalGardenContractAddress),
      name: 'pendingPlantInPlantMasterGardener',
    }
  })

  const callsFreezeContractTillBlocks = verticalGardensTotalStaked.map((verticalGardenConfig) => {
    return {
      address: getAddress(verticalGardenConfig.verticalGardenContractAddress),
      name: 'freezeContractTillBlock',
    }
  })
  const callsLastRewardUpdateBlock = verticalGardensTotalStaked.map((verticalGardenConfig) => {
    return {
      address: getAddress(verticalGardenConfig.verticalGardenContractAddress),
      name: 'lastUpdBlockNumber',
    }
  })

  const callsLastRewardUpdateBlockPrevious = verticalGardensTotalStaked.map((verticalGardenConfig) => {
    return {
      address: getAddress(verticalGardenConfig.verticalGardenContractAddress),
      name: 'lastUpdBlockNumberPrevious',
    }
  })
  
  const callsLastRewardUpdateTotalStakedToken = verticalGardensTotalStaked.map((verticalGardenConfig) => {
    return {
      address: getAddress(verticalGardenConfig.verticalGardenContractAddress),
      name: 'lastUpdTotalStakedToken',
    }
  })
  
  const callsLastRewardUpdateRewardTokenGained = verticalGardensTotalStaked.map((verticalGardenConfig) => {
    return {
      address: getAddress(verticalGardenConfig.verticalGardenContractAddress),
      name: 'lastUpdRewardTokenGained',
    }
  })
  
  const callsLastRewardUpdatePlantGained = verticalGardensTotalStaked.map((verticalGardenConfig) => {
    return {
      address: getAddress(verticalGardenConfig.verticalGardenContractAddress),
      name: 'lastUpdPlantGained',
    }
  })

  const totalStakeds = await multicall(verticalGardenABI, callsTotalStaked)
  const totalStakedEachBlocks = await multicall(verticalGardenABI, callsTotalStakedEachBlock)
  const totalPendingStakedRewardToSplits = await multicall(verticalGardenABI, callsTotalPendingStakedRewardToSplit)
  const totalPendingPlantRewardToSplits = await multicall(verticalGardenABI, callsTotalPendingPlantRewardToSplit)
  const pendingStakedInStakedMasterChefs = await multicall(verticalGardenABI, callsPendingStakedInStakedMasterChef)
  const pendingPlantInPlantMasterGardeners = await multicall(verticalGardenABI, callsPendingPlantInPlantMasterGardener)
  const freezeContractTillBlocks = await multicall(verticalGardenABI, callsFreezeContractTillBlocks)
  const lastRewardUpdateBlocks = await multicall(verticalGardenABI, callsLastRewardUpdateBlock)
  const lastRewardUpdateBlockPreviouss = await multicall(verticalGardenABI, callsLastRewardUpdateBlockPrevious)
  const lastRewardUpdateTotalStakedTokens = await multicall(verticalGardenABI, callsLastRewardUpdateTotalStakedToken)
  const lastRewardUpdateRewardTokenGaineds = await multicall(verticalGardenABI, callsLastRewardUpdateRewardTokenGained)
  const lastRewardUpdatePlantGaineds = await multicall(verticalGardenABI, callsLastRewardUpdatePlantGained)


  return verticalGardensTotalStaked.map((plantVerticalGardenConfig, index) => {
    const totalStaked = totalStakeds[index]
    const totalStakedEachBlock = totalStakedEachBlocks[index]
    const totalPendingStakedRewardToSplit = totalPendingStakedRewardToSplits[index]
    const totalPendingPlantRewardToSplit = totalPendingPlantRewardToSplits[index]
    const pendingStakedInStakedMasterChef = pendingStakedInStakedMasterChefs[index]
    const pendingPlantInPlantMasterGardener = pendingPlantInPlantMasterGardeners[index]
    const freezeContractTillBlock = freezeContractTillBlocks[index]
    const lastRewardUpdateBlock = lastRewardUpdateBlocks[index]
    const lastRewardUpdateBlockPrevious = lastRewardUpdateBlockPreviouss[index]
    const lastRewardUpdateTotalStakedToken = lastRewardUpdateTotalStakedTokens[index]
    const lastRewardUpdateRewardTokenGained = lastRewardUpdateRewardTokenGaineds[index]
    const lastRewardUpdatePlantGained = lastRewardUpdatePlantGaineds[index]
    return {
      vgId: plantVerticalGardenConfig.vgId,
      totalStaked: new BigNumber(totalStaked).toJSON(),
      totalStakedEachBlock: new BigNumber(totalStakedEachBlock).toJSON(),
      totalPendingStakedRewardToSplit: new BigNumber(totalPendingStakedRewardToSplit).toJSON(),
      totalPendingPlantRewardToSplit: new BigNumber(totalPendingPlantRewardToSplit).toJSON(),
      pendingStakedInStakedMasterChef: new BigNumber(pendingStakedInStakedMasterChef).toJSON(),
      pendingPlantInPlantMasterGardener: new BigNumber(pendingPlantInPlantMasterGardener).toJSON(),
      freezeContractTillBlock: new BigNumber(freezeContractTillBlock).toJSON(),
      lastRewardUpdateBlock: new BigNumber(lastRewardUpdateBlock).toJSON(), 
      lastRewardUpdateBlockPrevious: new BigNumber(lastRewardUpdateBlockPrevious).toJSON(),
      lastRewardUpdateTotalStakedToken: new BigNumber(lastRewardUpdateTotalStakedToken).toJSON(),
      lastRewardUpdateRewardTokenGained: new BigNumber(lastRewardUpdateRewardTokenGained).toJSON(),
      lastRewardUpdatePlantGained: new BigNumber(lastRewardUpdatePlantGained).toJSON(),
    }
  })
}

export const fetchVerticalGardenInfo = async () => { // NEW
  const verticalGardensInfo = verticalGardensConfig.filter((v) => v.vgId !== 0)
  const callsDepositActive = verticalGardensInfo.map((verticalGardenConfig) => {
    return {
      address: getAddress(verticalGardenConfig.verticalGardenContractAddress),
      name: 'depositActive',
    }
  })
  const callsFreezeContract = verticalGardensInfo.map((verticalGardenConfig) => {
    return {
      address: getAddress(verticalGardenConfig.verticalGardenContractAddress),
      name: 'freezeContract',
    }
  })
  const callsFreezeContractTillBlocks = verticalGardensInfo.map((verticalGardenConfig) => {
    return {
      address: getAddress(verticalGardenConfig.verticalGardenContractAddress),
      name: 'freezeContractTillBlock',
    }
  })
  const callsLastRewardUpdateBlock = verticalGardensInfo.map((verticalGardenConfig) => {
    return {
      address: getAddress(verticalGardenConfig.verticalGardenContractAddress),
      name: 'lastUpdBlockNumber',
    }
  })

  const callsLastRewardUpdateBlockPrevious = verticalGardensInfo.map((verticalGardenConfig) => {
    return {
      address: getAddress(verticalGardenConfig.verticalGardenContractAddress),
      name: 'lastUpdBlockNumberPrevious',
    }
  })
  
  const callsLastRewardUpdateTotalStakedToken = verticalGardensInfo.map((verticalGardenConfig) => {
    return {
      address: getAddress(verticalGardenConfig.verticalGardenContractAddress),
      name: 'lastUpdTotalStakedToken',
    }
  })
  
  const callsLastRewardUpdateRewardTokenGained = verticalGardensInfo.map((verticalGardenConfig) => {
    return {
      address: getAddress(verticalGardenConfig.verticalGardenContractAddress),
      name: 'lastUpdRewardTokenGained',
    }
  })
  
  const callsLastRewardUpdatePlantGained = verticalGardensInfo.map((verticalGardenConfig) => {
    return {
      address: getAddress(verticalGardenConfig.verticalGardenContractAddress),
      name: 'lastUpdPlantGained',
    }
  })

  const depositActives = await multicall(verticalGardenABI, callsDepositActive)
  const freezeContracts = await multicall(verticalGardenABI, callsFreezeContract)
  const freezeContractTillBlocks = await multicall(verticalGardenABI, callsFreezeContractTillBlocks)
  const lastRewardUpdateBlocks = await multicall(verticalGardenABI, callsLastRewardUpdateBlock)
  const lastRewardUpdateBlockPreviouss = await multicall(verticalGardenABI, callsLastRewardUpdateBlockPrevious)
  const lastRewardUpdateTotalStakedTokens = await multicall(verticalGardenABI, callsLastRewardUpdateTotalStakedToken)
  const lastRewardUpdateRewardTokenGaineds = await multicall(verticalGardenABI, callsLastRewardUpdateRewardTokenGained)
  const lastRewardUpdatePlantGaineds = await multicall(verticalGardenABI, callsLastRewardUpdatePlantGained)
  

  return verticalGardensInfo.map((plantVerticalGardenConfig, index) => {
    const depositActive = depositActives[index]
    const freezeContract = freezeContracts[index]
    const freezeContractTillBlock = freezeContractTillBlocks[index]
    const lastRewardUpdateBlock = lastRewardUpdateBlocks[index]
    const lastRewardUpdateBlockPrevious = lastRewardUpdateBlockPreviouss[index]
    const lastRewardUpdateTotalStakedToken = lastRewardUpdateTotalStakedTokens[index]
    const lastRewardUpdateRewardTokenGained = lastRewardUpdateRewardTokenGaineds[index]
    const lastRewardUpdatePlantGained = lastRewardUpdatePlantGaineds[index]
    return {
      vgId: plantVerticalGardenConfig.vgId,
      depositActive: depositActive.toJSON(),
      freezeContract: freezeContract.toJSON(),
      freezeContractTillBlock: new BigNumber(freezeContractTillBlock).toJSON(),
      lastRewardUpdateBlock: new BigNumber(lastRewardUpdateBlock).toJSON(), 
      lastRewardUpdateBlockPrevious: new BigNumber(lastRewardUpdateBlockPrevious).toJSON(),
      lastRewardUpdateTotalStakedToken: new BigNumber(lastRewardUpdateTotalStakedToken).toJSON(),
      lastRewardUpdateRewardTokenGained: new BigNumber(lastRewardUpdateRewardTokenGained).toJSON(),
      lastRewardUpdatePlantGained: new BigNumber(lastRewardUpdatePlantGained).toJSON(),
    }
  })
}


export const fetchVerticalGardensTotalStatking = async () => { // OLD
  const nonBnbVerticalGardens = verticalGardensConfig.filter((v) => v.stakingToken.symbol !== 'BNB')
  const bnbVerticalGarden = verticalGardensConfig.filter((v) => v.stakingToken.symbol === 'BNB')

  const callsNonBnbVerticalGardens = nonBnbVerticalGardens.map((verticalGardenConfig) => {
    return {
      address: getAddress(verticalGardenConfig.stakingToken.address),
      name: 'balanceOf',
      params: [getAddress(verticalGardenConfig.verticalGardenContractAddress)],
    }
  })

  const callsBnbVerticalGardens = bnbVerticalGarden.map((verticalGardenConfig) => {
    return {
      address: getWbnbAddress(),
      name: 'balanceOf',
      params: [getAddress(verticalGardenConfig.verticalGardenContractAddress)],
    }
  })

  const nonBnbVerticalGardensTotalStaked = await multicall(plantABI, callsNonBnbVerticalGardens)
  const bnbVerticalGardensTotalStaked = await multicall(wbnbABI, callsBnbVerticalGardens)

  return [
    ...nonBnbVerticalGardens.map((v, index) => ({
      vgId: v.vgId,
      totalStaked: new BigNumber(nonBnbVerticalGardensTotalStaked[index]).toJSON(),
    })),
    ...bnbVerticalGarden.map((v, index) => ({
      vgId: v.vgId,
      totalStaked: new BigNumber(bnbVerticalGardensTotalStaked[index]).toJSON(),
    })),
  ]
}
