import { createSlice } from '@reduxjs/toolkit'
import collectiblesFarmsConfig from 'config/constants/collectiblesFarms'
import { CollectiblesFarmsState, CollectiblesFarm, AppThunk } from 'state/types'
import { fetchCollectiblesFarmTotalStaked } from './fetchCollectiblesFarms'
import {
  fetchCollectiblesFarmsRewardTokenAllowance,
  fetchCollectiblesFarmsIsApprovedForAll,
  fetchUserCollectiblesBalance,
  fetchUserCollectiblesUses,
  fetchUserBalances,
  fetchUserRewardsHarvested,
  fetchUserExtraRewardsHarvested
} from './fetchCollectiblesFarmsUser'

const initialState: CollectiblesFarmsState = {
  data: [...collectiblesFarmsConfig],
  userDataLoaded: false,
}

// Thunks
export const fetchCollectiblesFarmsPublicDataAsync = () => async (dispatch) => {
  const totalStakeds = await fetchCollectiblesFarmTotalStaked()

  const liveData = collectiblesFarmsConfig.map((collectiblesFarm) => {
    const totalStaked = totalStakeds.find((entry) => entry.cfId === collectiblesFarm.cfId)
    const isPoolFinished = collectiblesFarm.isFinished

    return {
      ...totalStaked,
      isFinished: isPoolFinished,
    }
  })

  dispatch(setCollectiblesFarmsPublicData(liveData))
}

export const fetchCollectiblesFarmsUserDataAsync = (account: string): AppThunk =>
  async (dispatch) => {
    const allowancesRewardTokens = await fetchCollectiblesFarmsRewardTokenAllowance(account)
    const isApprovedForAlls = await fetchCollectiblesFarmsIsApprovedForAll(account)
    const collectiblesBalances = await fetchUserCollectiblesBalance(account)
    const collectiblesUses = await fetchUserCollectiblesUses(account)
    const nftBalances = await fetchUserBalances(account)
    const rewardsHarvestedss = await fetchUserRewardsHarvested(account)
    const extraRewardsHarvesteds = await fetchUserExtraRewardsHarvested(account)

    const userData = collectiblesFarmsConfig.map((collectiblesFarm) => ({
      cfId: collectiblesFarm.cfId,
      allowancesRewardToken: allowancesRewardTokens[collectiblesFarm.cfId],
      isApprovedForAll: isApprovedForAlls[collectiblesFarm.cfId],
      collectiblesBalance: collectiblesBalances[collectiblesFarm.cfId],
      collectiblesUse: collectiblesUses[collectiblesFarm.cfId],
      nftBalance: nftBalances[collectiblesFarm.cfId],
      rewardsHarvesteds: rewardsHarvestedss[collectiblesFarm.cfId],
      extraRewardsHarvested: extraRewardsHarvesteds[collectiblesFarm.cfId], 
    }))
    dispatch(setCollectiblesFarmsUserData(userData))
  } 
 
  export const cfupdateUserRewardTokenAllowance = (cfId: string, account: string) => async (dispatch) => {
    const allowancesRewardTokens = await fetchCollectiblesFarmsRewardTokenAllowance(account)
    dispatch(updateCollectiblesFarmsUserData({ cfId, field: 'allowancesRewardToken', value: allowancesRewardTokens[cfId] }))
  }
  
  export const cfupdateUserIsApprovedForAl = (cfId: string, account: string) => async (dispatch) => {
    const isApprovedForAlls = await fetchCollectiblesFarmsIsApprovedForAll(account)
    dispatch(updateCollectiblesFarmsUserData({ cfId, field: 'isApprovedForAll', value: isApprovedForAlls[cfId] }))
  }
  
  export const cfupdateUserCollectiblesBalance = (cfId: string, account: string) => async (dispatch) => {
    const collectiblesBalances = await fetchUserCollectiblesBalance(account)
    dispatch(updateCollectiblesFarmsUserData({ cfId, field: 'collectiblesBalance', value: collectiblesBalances[cfId] }))
  }
  
  export const cfupdateUserCollectiblesUse = (cfId: string, account: string) => async (dispatch) => {
    const collectiblesUses = await fetchUserCollectiblesUses(account)
    dispatch(updateCollectiblesFarmsUserData({ cfId, field: 'collectiblesUse', value: collectiblesUses[cfId] }))
  }
  
  export const cfupdateUserBalances = (cfId: string, account: string) => async (dispatch) => {
    const nftBalances = await fetchUserBalances(account)
    dispatch(updateCollectiblesFarmsUserData({ cfId, field: 'nftBalance', value: nftBalances[cfId] }))
  }
  
  export const cfupdateUserRewardsHarvested = (cfId: string, account: string) => async (dispatch) => {
    const rewardsHarvesteds = await fetchUserRewardsHarvested(account)
    dispatch(updateCollectiblesFarmsUserData({ cfId, field: 'rewardsHarvested', value: rewardsHarvesteds[cfId] }))
  }
  
  export const cfupdateUserExtraRewardsHarvested = (cfId: string, account: string) => async (dispatch) => {
    const extraRewardsHarvesteds = await fetchUserExtraRewardsHarvested(account)
    dispatch(updateCollectiblesFarmsUserData({ cfId, field: 'extraRewardsHarvested', value: extraRewardsHarvesteds[cfId] }))
  }

export const CollectiblesFarmsSlice = createSlice({
  name: 'CollectiblesFarms',
  initialState,
  reducers: {
    setCollectiblesFarmsPublicData: (state, action) => {
      const livePoolsData: CollectiblesFarm[] = action.payload
      state.data = state.data.map((collectiblesFarm) => {
        const livePoolData = livePoolsData.find((entry) => entry.cfId === collectiblesFarm.cfId)
        return { ...collectiblesFarm, ...livePoolData }
      })
    },
    setCollectiblesFarmsUserData: (state, action) => {
      const userData = action.payload
      state.data = state.data.map((collectiblesFarm) => {
        const userPoolData = userData.find((entry) => entry.cfId === collectiblesFarm.cfId)
        return { ...collectiblesFarm, userData: userPoolData }
      })
      state.userDataLoaded = true
    },
    updateCollectiblesFarmsUserData: (state, action) => {
      const { field, value, cfId } = action.payload
      const index = state.data.findIndex((c) => c.cfId === cfId)

      if (index >= 0) {
        state.data[index] = { ...state.data[index], userData: { ...state.data[index].userData, [field]: value } }
      }
    },
  },
})

// Actions
export const { 
  setCollectiblesFarmsPublicData, 
  setCollectiblesFarmsUserData, 
  updateCollectiblesFarmsUserData, 
 } = CollectiblesFarmsSlice.actions

export default CollectiblesFarmsSlice.reducer
