/**
 * Farms slice — exports both the legacy Redux reducer (kept for the
 * `state/index.ts` configureStore registration) and the new Zustand
 * action surface under the legacy thunk names so existing view imports
 * (`dispatch(fetchFarmUserDataAsync(...))`) keep working.
 *
 * The legacy `createAsyncThunk` types (`'farms/fetchFarmsPublicDataAsync'`
 * etc.) are intentionally preserved on the Zustand action labels so
 * Redux DevTools and any future debugging surfaces continue to see the
 * same action names.
 *
 * Behaviour-preserving notes:
 * - The two legacy thunks happen to share their `'farms/...'` type strings
 *   with `state/barns/pancakeswap/farms/`. That's a pre-existing cross-
 *   listening bug — kept as-is per the migration's no-bug-fix policy.
 */
import farmsConfig from 'config/constants/farms'
import isArchivedPid from 'utils/farmHelpers'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import priceHelperLpsConfig from 'config/constants/priceHelperLps'
import {
  fetchFarmUserAllowances,
  fetchFarmUserEarnings,
  fetchFarmUserStakedBalances,
  fetchFarmUserTokenBalances,
} from './fetchFarmUser'
import fetchFarms from './fetchFarms'
import fetchFarmsPrices from './fetchFarmsPrices'
import { FarmsState, Farm } from '../types'
import {
  fetchFarmUserData,
  fetchFarmsPublicData,
  setLoadArchivedFarmsData as setLoadArchivedFarmsDataAction,
  useFarmsStore,
} from './store'

// ---- legacy Redux slice (kept inert for the configureStore registration) ----

const noAccountFarmConfig = farmsConfig.map((farm) => ({
  ...farm,
  userData: {
    allowance: '0',
    tokenBalance: '0',
    stakedBalance: '0',
    earnings: '0',
  },
}))

const initialState: FarmsState = { data: noAccountFarmConfig, loadArchivedFarmsData: false, userDataLoaded: false }

const _legacyFetchFarmsPublicDataAsync = createAsyncThunk<Farm[], number[]>(
  'farms/fetchFarmsPublicDataAsync',
  async (pids) => {
    const farmsToFetch = farmsConfig.filter((farmConfig) => pids.includes(farmConfig.pid))
    const farmsWithPriceHelpers = farmsToFetch.concat(priceHelperLpsConfig)
    const farms = await fetchFarms(farmsWithPriceHelpers)
    const farmsWithPrices = await fetchFarmsPrices(farms)
    return farmsWithPrices.filter((farm: Farm) => farm.pid || farm.pid === 0)
  },
)

const _legacyFetchFarmUserDataAsync = createAsyncThunk<
  {
    pid: number
    allowance: string
    tokenBalance: string
    stakedBalance: string
    earnings: string
  }[],
  { account: string; pids: number[] }
>('farms/fetchFarmUserDataAsync', async ({ account, pids }) => {
  const farmsToFetch = farmsConfig.filter((farmConfig) => pids.includes(farmConfig.pid))
  const userFarmAllowances = await fetchFarmUserAllowances(account, farmsToFetch)
  const userFarmTokenBalances = await fetchFarmUserTokenBalances(account, farmsToFetch)
  const userStakedBalances = await fetchFarmUserStakedBalances(account, farmsToFetch)
  const userFarmEarnings = await fetchFarmUserEarnings(account, farmsToFetch)

  return userFarmAllowances.map((_, index) => ({
    pid: farmsToFetch[index].pid,
    allowance: userFarmAllowances[index],
    tokenBalance: userFarmTokenBalances[index],
    stakedBalance: userStakedBalances[index],
    earnings: userFarmEarnings[index],
  }))
})

export const farmsSlice = createSlice({
  name: 'Farms',
  initialState,
  reducers: {
    setLoadArchivedFarmsData: (state, action) => {
      state.loadArchivedFarmsData = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(_legacyFetchFarmsPublicDataAsync.fulfilled, (state, action) => {
      state.data = state.data.map((farm) => {
        const liveFarmData = action.payload.find((farmData) => farmData.pid === farm.pid)
        return { ...farm, ...liveFarmData }
      })
    })
    builder.addCase(_legacyFetchFarmUserDataAsync.fulfilled, (state, action) => {
      action.payload.forEach((userDataEl) => {
        const index = state.data.findIndex((farm) => farm.pid === userDataEl.pid)
        state.data[index] = { ...state.data[index], userData: userDataEl }
      })
      state.userDataLoaded = true
    })
  },
})

// ---- public surface: Zustand actions, exported under legacy names ----

// Re-export the Zustand action functions under the names previously held
// by the Redux thunks. Callers that do `dispatch(fetchFarmUserDataAsync(...))`
// now invoke the Zustand action (which mutates the store) and pass the
// resulting `undefined` to Redux — a silent no-op.
export const fetchFarmsPublicDataAsync = fetchFarmsPublicData
export const fetchFarmUserDataAsync = fetchFarmUserData
export const setLoadArchivedFarmsData = setLoadArchivedFarmsDataAction

export const nonArchivedFarms = farmsConfig.filter(({ pid }) => !isArchivedPid(pid))

export { useFarmsStore }

// Default reducer — kept so the legacy `state/index.ts` configureStore
// registration compiles through Phase 7.
export default farmsSlice.reducer