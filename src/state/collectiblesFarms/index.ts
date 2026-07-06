/**
 * CollectiblesFarms slice — exports both the legacy Redux reducer (kept
 * inert for `state/index.ts`'s configureStore registration) and the new
 * Zustand action surface under the legacy thunk/action names.
 */
import { createSlice } from '@reduxjs/toolkit'
import collectiblesFarmsConfig from 'config/constants/collectiblesFarms'
import { CollectiblesFarmsState } from 'state/types'

const initialState: CollectiblesFarmsState = {
  data: [...collectiblesFarmsConfig],
  userDataLoaded: false,
}

const _legacySetCollectiblesFarmsPublicData = (state, action) => {
  state.data = state.data.map((cf) => {
    const liveData = (action.payload as any[]).find((entry) => entry.cfId === cf.cfId)
    return liveData ? { ...cf, ...liveData } : cf
  })
}

const _legacySetCollectiblesFarmsUserData = (state, action) => {
  state.data = state.data.map((cf) => {
    const userData = (action.payload as any[]).find((entry) => entry.cfId === cf.cfId)
    return userData ? { ...cf, userData } : cf
  })
  state.userDataLoaded = true
}

const _legacyUpdateCollectiblesFarmsUserData = (state, action) => {
  const { field, value, cfId } = action.payload
  const index = state.data.findIndex((cf) => cf.cfId === cfId)
  if (index >= 0) {
    state.data[index] = { ...state.data[index], userData: { ...state.data[index].userData, [field]: value } }
  }
}

const collectiblesFarmsSlice = createSlice({
  name: 'CollectiblesFarms',
  initialState,
  reducers: {
    setCollectiblesFarmsPublicData: _legacySetCollectiblesFarmsPublicData,
    setCollectiblesFarmsUserData: _legacySetCollectiblesFarmsUserData,
    updateCollectiblesFarmsUserData: _legacyUpdateCollectiblesFarmsUserData,
  },
})

export {
  setCollectiblesFarmsPublicData,
  setCollectiblesFarmsUserData,
  updateCollectiblesFarmsUserData,
  fetchCollectiblesFarmsPublicData as fetchCollectiblesFarmsPublicDataAsync,
  fetchCollectiblesFarmsUserData as fetchCollectiblesFarmsUserDataAsync,
  cfupdateUserRewardTokenAllowance,
  cfupdateUserIsApprovedForAl,
  cfupdateUserCollectiblesBalance,
  cfupdateUserCollectiblesUse,
  cfupdateUserBalances,
  cfupdateUserRewardsHarvested,
  cfupdateUserExtraRewardsHarvested,
  useCollectiblesFarmsStore,
} from './store'

export default collectiblesFarmsSlice.reducer