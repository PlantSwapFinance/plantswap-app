/**
 * Pools slice — exports both the legacy Redux reducer (kept inert for
 * `state/index.ts`'s configureStore registration) and the new Zustand
 * action surface under the legacy thunk/action names.
 */
import { createSlice } from '@reduxjs/toolkit'
import poolsConfig from 'config/constants/pools'
import { PoolsState, Pool } from 'state/types'

const initialState: PoolsState = {
  data: [...poolsConfig],
  userDataLoaded: false,
}

const _legacySetPoolsPublicData = (state, action) => {
  state.data = state.data.map((pool) => {
    const livePoolData = (action.payload as Pool[]).find((entry) => entry.sousId === pool.sousId)
    return livePoolData ? { ...pool, ...livePoolData } : pool
  })
}

const _legacySetPoolsUserData = (state, action) => {
  state.data = state.data.map((pool) => {
    const userPoolData = (action.payload as any[]).find((entry) => entry.sousId === pool.sousId)
    return userPoolData ? { ...pool, userData: userPoolData } : pool
  })
  state.userDataLoaded = true
}

const _legacyUpdatePoolsUserData = (state, action) => {
  const { field, value, sousId } = action.payload
  const index = state.data.findIndex((p) => p.sousId === sousId)
  if (index >= 0) {
    state.data[index] = { ...state.data[index], userData: { ...state.data[index].userData, [field]: value } }
  }
}

const PoolsSlice = createSlice({
  name: 'Pools',
  initialState,
  reducers: {
    setPoolsPublicData: _legacySetPoolsPublicData,
    setPoolsUserData: _legacySetPoolsUserData,
    updatePoolsUserData: _legacyUpdatePoolsUserData,
  },
})

export {
  setPoolsPublicData,
  setPoolsUserData,
  updatePoolsUserData,
  fetchPoolsPublicData as fetchPoolsPublicDataAsync,
  fetchPoolsStakingLimits as fetchPoolsStakingLimitsAsync,
  fetchPoolsUserData as fetchPoolsUserDataAsync,
  updateUserAllowance,
  updateUserBalance,
  updateUserStakedBalance,
  updateUserPendingReward,
  usePoolsStore,
} from './store'

export default PoolsSlice.reducer