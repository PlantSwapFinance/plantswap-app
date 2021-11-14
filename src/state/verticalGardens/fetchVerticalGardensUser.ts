import verticalGardensConfig from 'config/constants/verticalGardens'
import verticalGardenABI from 'config/abi/verticalGardens.json'
import erc20ABI from 'config/abi/erc20.json'
import multicall from 'utils/multicall'
import { getAddress } from 'utils/addressHelpers'
import BigNumber from 'bignumber.js'

const listVerticalGardens = verticalGardensConfig.filter((v) => v.vgId)

export const fetchVerticalGardensAllowance = async (account) => {
  const calls = listVerticalGardens.map((v) => ({
    address: getAddress(v.stakingToken.address),
    name: 'allowance',
    params: [account, getAddress(v.verticalGardenContractAddress)],
  }))

  const allowances = await multicall(erc20ABI, calls)
  return listVerticalGardens.reduce(
    (acc, verticalGarden, index) => ({ ...acc, [verticalGarden.vgId]: new BigNumber(allowances[index]).toJSON() }),
    {},
  )
}

export const fetchVerticalGardensRewardAllowance = async (account) => {
  const calls = listVerticalGardens.map((v) => ({
    address: getAddress(v.stakingRewardToken.address),
    name: 'allowance',
    params: [account, getAddress(v.verticalGardenContractAddress)],
  }))

  const allowancesReward = await multicall(erc20ABI, calls)
  return listVerticalGardens.reduce(
    (acc, verticalGarden, index) => ({ ...acc, [verticalGarden.vgId]: new BigNumber(allowancesReward[index]).toJSON() }),
    {},
  )
}

export const fetchVerticalGardensAllowancePlant = async (account) => {
  const calls = listVerticalGardens.map((v) => ({
    address: getAddress(v.verticalEarningToken.address),
    name: 'allowance',
    params: [account, getAddress(v.verticalGardenContractAddress)],
  }))

  const allowancesPlant = await multicall(erc20ABI, calls)
  return listVerticalGardens.reduce(
    (acc, verticalGarden, index) => ({ ...acc, [verticalGarden.vgId]: new BigNumber(allowancesPlant[index]).toJSON() }),
    {},
  )
}

export const fetchUserBalances = async (account) => {
  // Non BNB verticalGardens
  const calls = listVerticalGardens.map((v) => ({
    address: getAddress(v.stakingToken.address),
    name: 'balanceOf',
    params: [account],
  }))
  const tokenBalancesRaw = await multicall(erc20ABI, calls)
  const tokenBalances = listVerticalGardens.reduce(
    (acc, verticalGarden, index) => ({ ...acc, [verticalGarden.vgId]: new BigNumber(tokenBalancesRaw[index]).toJSON() }),
    {},
  )

  return { ...tokenBalances }
}

export const fetchUserStakeBalances = async (account) => {
  const calls = listVerticalGardens.map((v) => ({
    address: getAddress(v.verticalGardenContractAddress),
    name: 'gardeners',
    params: [account],
  }))
  const gardeners = await multicall(verticalGardenABI, calls)
  const stakedBalances = listVerticalGardens.reduce(
    (acc, verticalGarden, index) => ({...acc, [verticalGarden.vgId]: new BigNumber(gardeners[index][0]._hex).toJSON(), }),
    {},
  )

  return { ...stakedBalances }
}

export const fetchUserPendingRewards = async (account) => {
  const calls = listVerticalGardens.map((v) => ({
    address: getAddress(v.verticalGardenContractAddress),
    name: 'pendingRewardToken',
    params: [account],
  }))
  const res = await multicall(verticalGardenABI, calls)
  const pendingRewards = listVerticalGardens.reduce(
    (acc, verticalGarden, index) => ({
      ...acc,
      [verticalGarden.vgId]: new BigNumber(res[index][0]._hex).toJSON(),
    }),
    {},
  )

  return { ...pendingRewards }
}

export const fetchUserPendingPlantRewards = async (account) => {
  const calls = listVerticalGardens.map((v) => ({
    address: getAddress(v.verticalGardenContractAddress),
    name: 'pendingPlantReward',
    params: [account],
  }))
  const res = await multicall(verticalGardenABI, calls)
  const pendingPlantRewards = listVerticalGardens.reduce(
    (acc, verticalGarden, index) => ({
      ...acc,
      [verticalGarden.vgId]: new BigNumber(res[index][0]._hex).toJSON(),
    }),
    {},
  )
  
  return { ...pendingPlantRewards }
}

export const fetchUserEstimateRewards = async (account) => {
  const calls = listVerticalGardens.map((v) => ({
    address: getAddress(v.verticalGardenContractAddress),
    name: 'estimateRewardToken',
    params: [account],
  }))
  const res = await multicall(verticalGardenABI, calls)
  const estimateRewards = listVerticalGardens.reduce(
    (acc, verticalGarden, index) => ({
      ...acc,
      [verticalGarden.vgId]: new BigNumber(res[index][0]._hex).toJSON(),
    }),
    {},
  )

  return { ...estimateRewards }
}

export const fetchUserEstimatePlantRewards = async (account) => {
  const calls = listVerticalGardens.map((v) => ({
    address: getAddress(v.verticalGardenContractAddress),
    name: 'estimatePlantReward',
    params: [account],
  }))
  const res = await multicall(verticalGardenABI, calls)
  const estimatePlantRewards = listVerticalGardens.reduce(
    (acc, verticalGarden, index) => ({
      ...acc,
      [verticalGarden.vgId]: new BigNumber(res[index][0]._hex).toJSON(),
    }),
    {},
  )
  
  return { ...estimatePlantRewards }
}

export const fetchUserHarvestedRewards = async (account) => {
  const calls = listVerticalGardens.map((v) => ({
    address: getAddress(v.verticalGardenContractAddress),
    name: 'harvestedReward',
    params: [account],
  }))
  const res = await multicall(verticalGardenABI, calls)
  const harvestedRewards = listVerticalGardens.reduce(
    (acc, verticalGarden, index) => ({
      ...acc,
      [verticalGarden.vgId]: new BigNumber(res[index][0]._hex).toJSON(),
    }),
    {},
  )

  return { ...harvestedRewards }
}

export const fetchUserHarvestedPlants = async (account) => {
  const calls = listVerticalGardens.map((v) => ({
    address: getAddress(v.verticalGardenContractAddress),
    name: 'harvestedPlant',
    params: [account],
  }))
  const res = await multicall(verticalGardenABI, calls)
  const harvestedPlants = listVerticalGardens.reduce(
    (acc, verticalGarden, index) => ({
      ...acc,
      [verticalGarden.vgId]: new BigNumber(res[index][0]._hex).toJSON(),
    }),
    {},
  )

  return { ...harvestedPlants }
}

export const fetchUserCompoundedRewards = async (account) => {
  const calls = listVerticalGardens.map((v) => ({
    address: getAddress(v.verticalGardenContractAddress),
    name: 'compoudedReward',
    params: [account],
  }))
  const res = await multicall(verticalGardenABI, calls)
  const compoudedRewards = listVerticalGardens.reduce(
    (acc, verticalGarden, index) => ({
      ...acc,
      [verticalGarden.vgId]: new BigNumber(res[index][0]._hex).toJSON(),
    }),
    {},
  )

  return { ...compoudedRewards }
}