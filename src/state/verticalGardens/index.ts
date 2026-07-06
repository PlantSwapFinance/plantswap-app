/**
 * VerticalGardens slice — exports both the legacy Redux reducer (kept
 * inert for `state/index.ts`'s configureStore registration) and the new
 * Zustand action surface under the legacy thunk/action names.
 */
import { createSlice } from '@reduxjs/toolkit'
import verticalGardensConfig from 'config/constants/verticalGardens'
import { VerticalGardensState, VerticalGarden } from 'state/types'

const initialState: VerticalGardensState = {
  data: [...verticalGardensConfig],
  userDataLoaded: false,
}

const _legacySetVerticalGardensPublicData = (state, action) => {
  const livePoolsData: VerticalGarden[] = action.payload
  state.data = state.data.map((verticalGarden) => {
    const livePoolData = livePoolsData.find((entry) => entry.vgId === verticalGarden.vgId)
    return { ...verticalGarden, ...livePoolData }
  })
}

const _legacySetVerticalGardensUserData = (state, action) => {
  const userData = action.payload
  state.data = state.data.map((verticalGarden) => {
    const userPoolData = userData.find((entry) => entry.vgId === verticalGarden.vgId)
    return { ...verticalGarden, userData: userPoolData }
  })
  state.userDataLoaded = true
}

const _legacyUpdateVerticalGardensUserData = (state, action) => {
  const { field, value, vgId } = action.payload
  const index = state.data.findIndex((v) => v.vgId === vgId)
  if (index >= 0) {
    state.data[index] = { ...state.data[index], userData: { ...state.data[index].userData, [field]: value } }
  }
}

const VerticalGardensSlice = createSlice({
  name: 'VerticalGardens',
  initialState,
  reducers: {
    setVerticalGardensPublicData: _legacySetVerticalGardensPublicData,
    setVerticalGardensUserData: _legacySetVerticalGardensUserData,
    updateVerticalGardensUserData: _legacyUpdateVerticalGardensUserData,
  },
})

// Re-export Zustand actions under legacy names so existing view imports
// resolve to the new implementation.
export {
  setVerticalGardensPublicData,
  setVerticalGardensUserData,
  updateVerticalGardensUserData,
  fetchVerticalGardensPublicData as fetchVerticalGardensPublicDataAsync,
  fetchVerticalGardensUserData as fetchVerticalGardensUserDataAsync,
  vgupdateUserAllowance,
  vgupdateUserBalance,
  vgupdateUserStakedBalance,
  vgupdateUserPendingReward,
  vgupdateUserPendingPlantReward,
  vgupdateUserEstimateRewardToken,
  vgupdateUserEstimatePlantReward,
  vgupdateUserHarvestedReward,
  vgupdateUserHarvestedPlant,
  vgupdateUserCompoundedReward,
  useVerticalGardensStore,
} from './store'

export default VerticalGardensSlice.reducer