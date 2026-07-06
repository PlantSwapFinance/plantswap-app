import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import verticalGardensConfig from 'config/constants/verticalGardens'
import { VerticalGardensState, VerticalGarden } from 'state/types'
import { fetchVerticalGardenTotalStaked } from './fetchVerticalGardens'
import {
  fetchVerticalGardensAllowance,
  fetchVerticalGardensRewardAllowance,
  fetchVerticalGardensAllowancePlant,
  fetchUserBalances,
  fetchUserStakeBalances,
  fetchUserPendingRewards,
  fetchUserPendingPlantRewards,
  fetchUserEstimateRewards,
  fetchUserEstimatePlantRewards,
  fetchUserHarvestedRewards,
  fetchUserHarvestedPlants,
  fetchUserCompoundedRewards,
} from './fetchVerticalGardensUser'

export const initialState: VerticalGardensState = {
  data: [...verticalGardensConfig],
  userDataLoaded: false,
}

export const useVerticalGardensStore = create<VerticalGardensState>()(
  devtools(
    () => initialState,
    { name: 'verticalGardens' },
  ),
)

export const setVerticalGardensPublicData = (payload: VerticalGarden[]): void => {
  useVerticalGardensStore.setState(
    (state) => ({
      data: state.data.map((verticalGarden) => {
        const livePoolData = payload.find((entry) => entry.vgId === verticalGarden.vgId)
        return livePoolData ? { ...verticalGarden, ...livePoolData } : verticalGarden
      }),
    }),
    false,
    'verticalGardens/setVerticalGardensPublicData',
  )
}

export const setVerticalGardensUserData = (
  payload: VerticalGardensState['data'][number]['userData'][],
): void => {
  useVerticalGardensStore.setState(
    (state) => ({
      data: state.data.map((verticalGarden) => {
        const userPoolData = payload.find((entry) => entry.vgId === verticalGarden.vgId)
        return userPoolData ? { ...verticalGarden, userData: userPoolData } : verticalGarden
      }),
      userDataLoaded: true,
    }),
    false,
    'verticalGardens/setVerticalGardensUserData',
  )
}

export const updateVerticalGardensUserData = (payload: {
  vgId: string
  field: string
  value: unknown
}): void => {
  useVerticalGardensStore.setState(
    (state) => {
      const { field, value, vgId } = payload
      const index = state.data.findIndex((v) => v.vgId === vgId)
      if (index < 0) return state
      const updated = [...state.data]
      updated[index] = {
        ...updated[index],
        userData: { ...updated[index].userData, [field]: value },
      }
      return { data: updated }
    },
    false,
    'verticalGardens/updateVerticalGardensUserData',
  )
}

// Async thunks (Zustand-flavoured — replace the original Redux thunks)

export const fetchVerticalGardensPublicData = async (): Promise<void> => {
  const totalStakeds = await fetchVerticalGardenTotalStaked()
  const liveData = verticalGardensConfig.map((verticalGarden) => {
    const totalStaked = totalStakeds.find((entry) => entry.vgId === verticalGarden.vgId)
    return {
      ...totalStaked,
      isFinished: verticalGarden.isFinished,
    }
  })
  setVerticalGardensPublicData(liveData as VerticalGarden[])
}

export const fetchVerticalGardensUserData = async (account: string): Promise<void> => {
  const allowances = await fetchVerticalGardensAllowance(account)
  const allowancesReward = await fetchVerticalGardensRewardAllowance(account)
  const allowancesPlant = await fetchVerticalGardensAllowancePlant(account)
  const stakingTokenBalances = await fetchUserBalances(account)
  const stakedBalances = await fetchUserStakeBalances(account)
  const pendingRewards = await fetchUserPendingRewards(account)
  const pendingPlantRewards = await fetchUserPendingPlantRewards(account)
  const estimateRewards = await fetchUserEstimateRewards(account)
  const estimatePlantRewards = await fetchUserEstimatePlantRewards(account)
  const harvestedRewards = await fetchUserHarvestedRewards(account)
  const harvestedPlants = await fetchUserHarvestedPlants(account)
  const compoundedRewards = await fetchUserCompoundedRewards(account)

  const userData = verticalGardensConfig.map((verticalGarden) => ({
    vgId: verticalGarden.vgId,
    allowance: allowances[verticalGarden.vgId],
    allowanceReward: allowancesReward[verticalGarden.vgId],
    allowancePlant: allowancesPlant[verticalGarden.vgId],
    stakingTokenBalance: stakingTokenBalances[verticalGarden.vgId],
    stakedBalance: stakedBalances[verticalGarden.vgId],
    pendingReward: pendingRewards[verticalGarden.vgId],
    pendingPlantReward: pendingPlantRewards[verticalGarden.vgId],
    estimateReward: estimateRewards[verticalGarden.vgId],
    estimatePlantReward: estimatePlantRewards[verticalGarden.vgId],
    harvestedReward: harvestedRewards[verticalGarden.vgId],
    harvestedPlant: harvestedPlants[verticalGarden.vgId],
    compoundedReward: compoundedRewards[verticalGarden.vgId],
  }))

  setVerticalGardensUserData(userData)
}

export const vgupdateUserAllowance = async (vgId: string, account: string): Promise<void> => {
  const allowances = await fetchVerticalGardensAllowance(account)
  updateVerticalGardensUserData({ vgId, field: 'allowance', value: allowances[vgId] })
}

export const vgupdateUserBalance = async (vgId: string, account: string): Promise<void> => {
  const tokenBalances = await fetchUserBalances(account)
  updateVerticalGardensUserData({ vgId, field: 'stakingTokenBalance', value: tokenBalances[vgId] })
}

export const vgupdateUserStakedBalance = async (vgId: string, account: string): Promise<void> => {
  const stakedBalances = await fetchUserStakeBalances(account)
  updateVerticalGardensUserData({ vgId, field: 'gardeners', value: stakedBalances[vgId] })
}

export const vgupdateUserPendingReward = async (vgId: string, account: string): Promise<void> => {
  const pendingRewards = await fetchUserPendingRewards(account)
  updateVerticalGardensUserData({ vgId, field: 'pendingRewardToken', value: pendingRewards[vgId] })
}

export const vgupdateUserPendingPlantReward = async (vgId: string, account: string): Promise<void> => {
  const pendingPlantRewards = await fetchUserPendingPlantRewards(account)
  updateVerticalGardensUserData({ vgId, field: 'pendingPlantReward', value: pendingPlantRewards[vgId] })
}

export const vgupdateUserEstimateRewardToken = async (vgId: string, account: string): Promise<void> => {
  const estimateRewards = await fetchUserEstimateRewards(account)
  updateVerticalGardensUserData({ vgId, field: 'estimateReward', value: estimateRewards[vgId] })
}

export const vgupdateUserEstimatePlantReward = async (vgId: string, account: string): Promise<void> => {
  const estimatePlantRewards = await fetchUserEstimatePlantRewards(account)
  updateVerticalGardensUserData({ vgId, field: 'estimatePlantReward', value: estimatePlantRewards[vgId] })
}

export const vgupdateUserHarvestedReward = async (vgId: string, account: string): Promise<void> => {
  const harvestedRewards = await fetchUserHarvestedRewards(account)
  updateVerticalGardensUserData({ vgId, field: 'harvestedReward', value: harvestedRewards[vgId] })
}

export const vgupdateUserHarvestedPlant = async (vgId: string, account: string): Promise<void> => {
  const harvestedPlants = await fetchUserHarvestedPlants(account)
  updateVerticalGardensUserData({ vgId, field: 'harvestedPlant', value: harvestedPlants[vgId] })
}

export const vgupdateUserCompoundedReward = async (vgId: string, account: string): Promise<void> => {
  const compoundedRewards = await fetchUserCompoundedRewards(account)
  updateVerticalGardensUserData({ vgId, field: 'compoudedReward', value: compoundedRewards[vgId] })
}