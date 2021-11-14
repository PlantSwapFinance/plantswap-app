import { createSlice } from '@reduxjs/toolkit'
import verticalGardensConfig from 'config/constants/verticalGardens'
import { VerticalGardensState, VerticalGarden, AppThunk } from 'state/types'
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

const initialState: VerticalGardensState = {
  data: [...verticalGardensConfig],
  userDataLoaded: false,
}

// Thunks
export const fetchVerticalGardensPublicDataAsync = () => async (dispatch) => {
  const totalStakeds = await fetchVerticalGardenTotalStaked()

  const liveData = verticalGardensConfig.map((verticalGarden) => {
    const totalStaked = totalStakeds.find((entry) => entry.vgId === verticalGarden.vgId)
    const isPoolFinished = verticalGarden.isFinished

    return {
      ...totalStaked,
      isFinished: isPoolFinished,
    }
  })

  dispatch(setVerticalGardensPublicData(liveData))
}

export const fetchVerticalGardensUserDataAsync =
  (account: string): AppThunk =>
  async (dispatch) => {
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
    const compoundedRewards= await fetchUserCompoundedRewards(account)

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

    dispatch(setVerticalGardensUserData(userData))
  }


  export const vgupdateUserAllowance = (vgId: string, account: string) => async (dispatch) => {
    const allowances = await fetchVerticalGardensAllowance(account)
    dispatch(updateVerticalGardensUserData({ vgId, field: 'allowance', value: allowances[vgId] }))
  }
  
  export const vgupdateUserBalance = (vgId: string, account: string) => async (dispatch) => {
    const tokenBalances = await fetchUserBalances(account)
    dispatch(updateVerticalGardensUserData({ vgId, field: 'stakingTokenBalance', value: tokenBalances[vgId] }))
  }
  
  export const vgupdateUserStakedBalance = (vgId: string, account: string) => async (dispatch) => {
    const stakedBalances = await fetchUserStakeBalances(account)
    dispatch(updateVerticalGardensUserData({ vgId, field: 'gardeners', value: stakedBalances[vgId] }))
  }
  
  export const vgupdateUserPendingReward = (vgId: string, account: string) => async (dispatch) => {
    const pendingRewards = await fetchUserPendingRewards(account)
    dispatch(updateVerticalGardensUserData({ vgId, field: 'pendingRewardToken', value: pendingRewards[vgId] }))
  }
  
  export const vgupdateUserPendingPlantReward = (vgId: string, account: string) => async (dispatch) => {
    const pendingPlantRewards = await fetchUserPendingPlantRewards(account)
    dispatch(updateVerticalGardensUserData({ vgId, field: 'pendingPlantReward', value: pendingPlantRewards[vgId] }))
  }
  
  export const vgupdateUserEstimateRewardToken = (vgId: string, account: string) => async (dispatch) => {
    const estimateRewards = await fetchUserEstimateRewards(account)
    dispatch(updateVerticalGardensUserData({ vgId, field: 'estimateReward', value: estimateRewards[vgId] }))
  }
  
  export const vgupdateUserEstimatePlantReward = (vgId: string, account: string) => async (dispatch) => {
    const estimatePlantRewards = await fetchUserEstimatePlantRewards(account)
    dispatch(updateVerticalGardensUserData({ vgId, field: 'estimatePlantReward', value: estimatePlantRewards[vgId] }))
  }
  
  export const vgupdateUserHarvestedReward = (vgId: string, account: string) => async (dispatch) => {
    const harvestedRewards = await fetchUserHarvestedRewards(account)
    dispatch(updateVerticalGardensUserData({ vgId, field: 'harvestedReward', value: harvestedRewards[vgId] }))
  }
  
  export const vgupdateUserHarvestedPlant = (vgId: string, account: string) => async (dispatch) => {
    const harvestedPlants = await fetchUserHarvestedPlants(account)
    dispatch(updateVerticalGardensUserData({ vgId, field: 'harvestedPlant', value: harvestedPlants[vgId] }))
  }
  
  export const vgupdateUserCompoundedReward = (vgId: string, account: string) => async (dispatch) => {
    const harvestedPlants = await fetchUserCompoundedRewards(account)
    dispatch(updateVerticalGardensUserData({ vgId, field: 'compoudedReward', value: harvestedPlants[vgId] }))
  }

export const VerticalGardensSlice = createSlice({
  name: 'VerticalGardens',
  initialState,
  reducers: {
    setVerticalGardensPublicData: (state, action) => {
      const livePoolsData: VerticalGarden[] = action.payload
      state.data = state.data.map((verticalGarden) => {
        const livePoolData = livePoolsData.find((entry) => entry.vgId === verticalGarden.vgId)
        return { ...verticalGarden, ...livePoolData }
      })
    },
    setVerticalGardensUserData: (state, action) => {
      const userData = action.payload
      state.data = state.data.map((verticalGarden) => {
        const userPoolData = userData.find((entry) => entry.vgId === verticalGarden.vgId)
        return { ...verticalGarden, userData: userPoolData }
      })
      state.userDataLoaded = true
    },
    updateVerticalGardensUserData: (state, action) => {
      const { field, value, vgId } = action.payload
      const index = state.data.findIndex((v) => v.vgId === vgId)

      if (index >= 0) {
        state.data[index] = { ...state.data[index], userData: { ...state.data[index].userData, [field]: value } }
      }
    },
  },
})

// Actions
export const { setVerticalGardensPublicData, setVerticalGardensUserData, updateVerticalGardensUserData } = VerticalGardensSlice.actions

export default VerticalGardensSlice.reducer
