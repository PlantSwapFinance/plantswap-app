/**
 * BarnPancakeswapFarms slice — exports both the legacy Redux reducer
 * (kept inert for `state/index.ts`'s configureStore registration) and
 * the new Zustand action surface under the legacy thunk names.
 *
 * Behaviour-preserving note: this slice shares thunk type strings with
 * `state/farms/` (both register `'farms/fetchFarmsPublicDataAsync'` and
 * `'farms/fetchFarmUserDataAsync'`). Kept as-is — pre-existing
 * cross-listening bug, separate fix.
 */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import farmsConfig from 'config/constants/barns/pancakeswap/farms'
import isArchivedPid from 'utils/farmHelpers'
import priceHelperLpsConfig from 'config/constants/priceHelperLps'
import fetchFarms from './fetchFarms'
import fetchFarmsPrices from './fetchFarmsPrices'
import {
  fetchFarmUserEarnings,
  fetchFarmUserAllowances,
  fetchFarmUserTokenBalances,
  fetchFarmUserStakedBalances,
} from './fetchFarmUser'
import { BarnPancakeswapFarmsState, BarnPancakeswapFarm } from '../../../types'

const noAccountFarmConfig = farmsConfig.map((farm) => ({
  ...farm,
  userData: {
    allowance: '0',
    tokenBalance: '0',
    stakedBalance: '0',
    earnings: '0',
  },
}))

const initialState: BarnPancakeswapFarmsState = {
  data: noAccountFarmConfig,
  loadArchivedFarmsData: false,
  userDataLoaded: false,
}

export const nonArchivedFarms = farmsConfig.filter(({ pid }) => !isArchivedPid(pid))

const _legacyFetchFarmsPublicDataAsync = createAsyncThunk<BarnPancakeswapFarm[], number[]>(
  'farms/fetchFarmsPublicDataAsync',
  async (pids) => {
    const farmsToFetch = farmsConfig.filter((farmConfig) => pids.includes(farmConfig.pid))
    const farmsWithPriceHelpers = farmsToFetch.concat(priceHelperLpsConfig)
    const farms = await fetchFarms(farmsWithPriceHelpers)
    const farmsWithPrices = await fetchFarmsPrices(farms)
    return farmsWithPrices.filter((farm: BarnPancakeswapFarm) => farm.pid || farm.pid === 0)
  },
)

const _legacyFetchFarmUserDataAsync = createAsyncThunk<
  { pid: number; allowance: string; tokenBalance: string; stakedBalance: string; earnings: string }[],
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

const farmsSlice = createSlice({
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

export {
  fetchFarmsPublicData as fetchFarmsPublicDataAsync,
  fetchFarmUserData as fetchFarmUserDataAsync,
  setLoadArchivedFarmsData,
  useBarnPancakeswapFarmsStore,
} from './store'

export default farmsSlice.reducer